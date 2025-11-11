import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import 'ol/ol.css';

interface FilterState {
  lga: string;
  ward: string;
  period: string;
  metric: string;
}

interface MetricConfig {
  id: string;
  name: string;
  layerFile: string;
  description: string;
}

const QGISFilterableMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);
  const dataLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const allFeaturesRef = useRef<any[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    lga: '',
    ward: '',
    period: '',
    metric: 'severe_malaria'
  });

  const [lgas, setLgas] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Available metrics (fetched from API)
  const metrics: MetricConfig[] = [
    {
      id: 'severe_malaria',
      name: 'Severe Malaria Cases',
      layerFile: '', // No longer needed - using API only
      description: 'Cases of severe malaria reported by health facilities'
    },
    {
      id: 'sickle_cell',
      name: 'Sickle Cell Cases',
      layerFile: '', // No longer needed - using API only
      description: 'Sickle cell disease cases reported by health facilities'
    },
    {
      id: 'breast_cancer',
      name: 'Breast Cancer Cases',
      layerFile: '', // No longer needed - using API only
      description: 'Breast cancer cases reported by health facilities'
    },
    {
      id: 'death_cases',
      name: 'Death Cases',
      layerFile: '', // No longer needed - using API only
      description: 'Death cases reported by health facilities'
    }
  ];

  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:3001';

  const currentMetric = metrics.find(m => m.id === filters.metric) || metrics[0];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // Anambra State boundary layer (static)
    const boundarySource = new VectorSource();
    const boundaryLayer = new VectorLayer({
      source: boundarySource,
      style: new Style({
        stroke: new Stroke({
          color: '#333',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0)'
        })
      }),
      zIndex: 1
    });

    // Data layer (filterable)
    const dataSource = new VectorSource();
    const dataLayer = new VectorLayer({
      source: dataSource,
      style: (feature) => {
        const caseCount = feature.get('case_count') || 0;
        // Size based on case count
        const radius = Math.min(Math.max(caseCount / 10, 5), 20);
        return new Style({
          image: new Circle({
            radius: radius,
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.6)' }),
            stroke: new Stroke({ color: '#8B0000', width: 2 })
          }),
          text: new Text({
            text: caseCount > 0 ? caseCount.toString() : '',
            font: '12px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 })
          })
        });
      },
      zIndex: 2
    });
    dataLayerRef.current = dataLayer;

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, boundaryLayer, dataLayer],
      view: new View({
        center: fromLonLat([7.0, 6.2]),
        zoom: 9
      })
    });

    // Create popup element
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    popupElementRef.current = popupElement;

    const overlay = new Overlay({
      element: popupElement,
      autoPan: { animation: { duration: 250 } }
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;

    // Click handler
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature && feature.get('case_count') !== undefined) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coords = geometry.getCoordinates();
          overlay.setPosition(coords);
          popupElement.innerHTML = `
            <div class="p-4 bg-white rounded-lg shadow-lg max-w-sm relative">
              <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onclick="this.parentElement.style.display='none'">×</button>
              <h3 class="font-bold text-lg mb-2">${feature.get('facility_name') || 'Unknown Facility'}</h3>
              <p class="text-sm text-gray-600"><strong>LGA:</strong> ${feature.get('lga_name') || 'N/A'}</p>
              <p class="text-sm text-gray-600"><strong>Ward:</strong> ${feature.get('parentwardname') || 'N/A'}</p>
              <p class="text-sm text-gray-600"><strong>Period:</strong> ${feature.get('period') || 'N/A'}</p>
              <p class="text-sm text-red-600 font-bold mt-2"><strong>Cases:</strong> ${feature.get('case_count') || 0}</p>
            </div>
          `;
          popupElement.style.display = 'block';
        }
      } else {
        popupElement.style.display = 'none';
      }
    });

    mapInstanceRef.current = map;

    // Load boundary
    loadBoundary(boundarySource);

    return () => {
      overlay.setPosition(undefined);
      map.removeOverlay(overlay);
      if (popupElementRef.current) {
        popupElementRef.current.remove();
        popupElementRef.current = null;
      }
      map.setTarget(undefined);
      map.dispose();
      mapInstanceRef.current = null;
      overlayRef.current = null;
    };
  }, []);

  // Load boundary layer
  const loadBoundary = async (source: VectorSource) => {
    try {
      const response = await fetch('/qgis-maps/qgis_export/layers/Anambra_State_1.js');
      const text = await response.text();
      
      // Extract JSON from the JS file
      const jsonMatch = text.match(/var\s+json_[^\s]+\s*=\s*(\{.+\});?$/);
      if (jsonMatch) {
        const geojson = JSON.parse(jsonMatch[1]);
        const features = new GeoJSON().readFeatures(geojson, {
          featureProjection: 'EPSG:3857'
        });
        source.addFeatures(features);
      }
    } catch (error) {
      console.error('Error loading boundary:', error);
    }
  };

  // Load data when metric changes
  useEffect(() => {
    loadMetricData();
  }, [filters.metric]);

  // Load metric data from API
  const loadMetricData = async () => {
    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/api/health-metrics/${filters.metric}`;
      console.log('Fetching from API:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const geojson = await response.json();
      console.log('✓ Loaded from API:', geojson.metadata);

      // Process GeoJSON features
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });
      
      allFeaturesRef.current = features;
      
      // Extract unique values for filters
      const uniqueLgas = [...new Set(features.map((f: any) => f.get('lga_name')).filter(Boolean))].sort();
      const uniquePeriods = [...new Set(features.map((f: any) => f.get('period')).filter(Boolean))].sort();
      
      setLgas(uniqueLgas as string[]);
      setPeriods(uniquePeriods as string[]);
      
      // Apply initial filter
      applyFilters(features);
    } catch (error) {
      console.error('Error loading metric data:', error);
      // Show error message to user
      alert('Failed to load health metrics data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    if (allFeaturesRef.current.length > 0) {
      applyFilters(allFeaturesRef.current);
    }
  }, [filters.lga, filters.ward, filters.period]);

  // Update wards when LGA changes
  useEffect(() => {
    if (filters.lga && allFeaturesRef.current.length > 0) {
      const wardsInLga = [...new Set(
        allFeaturesRef.current
          .filter((f: any) => f.get('lga_name') === filters.lga)
          .map((f: any) => f.get('parentwardname'))
          .filter(Boolean)
      )].sort();
      setWards(wardsInLga as string[]);
    } else {
      setWards([]);
      setFilters(prev => ({ ...prev, ward: '' }));
    }
  }, [filters.lga]);

  const applyFilters = (features: any[]) => {
    if (!dataLayerRef.current) return;

    let filtered = features;

    if (filters.lga) {
      filtered = filtered.filter(f => f.get('lga_name') === filters.lga);
    }
    if (filters.ward) {
      filtered = filtered.filter(f => f.get('parentwardname') === filters.ward);
    }
    if (filters.period) {
      filtered = filtered.filter(f => f.get('period') === filters.period);
    }

    const source = dataLayerRef.current.getSource();
    if (source) {
      source.clear();
      source.addFeatures(filtered);

      // Auto-zoom to filtered features
      if (filtered.length > 0 && mapInstanceRef.current) {
        const extent = source.getExtent();
        mapInstanceRef.current.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 12,
          duration: 500
        });
      }
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'lga') updated.ward = '';
      if (key === 'metric') {
        updated.lga = '';
        updated.ward = '';
        updated.period = '';
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters(prev => ({ ...prev, lga: '', ward: '', period: '' }));
  };

  const filteredCount = dataLayerRef.current?.getSource()?.getFeatures().length || 0;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-2">Health Metrics Map</h2>
          <p className="text-sm text-gray-600">
            Showing {filteredCount} of {allFeaturesRef.current.length} records
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Metric Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Health Metric</label>
            <select
              value={filters.metric}
              onChange={(e) => handleFilterChange('metric', e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{currentMetric.description}</p>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Loading data...</p>
            </div>
          )}

          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Period</label>
            <select
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Periods</option>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

          {/* LGA Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">LGA</label>
            <select
              value={filters.lga}
              onChange={(e) => handleFilterChange('lga', e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All LGAs</option>
              {lgas.map(lga => (
                <option key={lga} value={lga}>{lga}</option>
              ))}
            </select>
          </div>

          {/* Ward Filter */}
          <div>
            <label className="block text-sm font-medium mb-1">Ward</label>
            <select
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              disabled={!filters.lga}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Wards</option>
              {wards.map(ward => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Reset Filters
          </button>

          {/* Legend */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600"></div>
                <span>Case location (size = case count)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default QGISFilterableMap;
