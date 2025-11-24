import React, { useEffect, useRef, useState } from 'react';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import OlMap from 'ol/Map';
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

interface LgaAggregate {
  lga: string;
  totalCases: number;
  facilities: number;
}

interface SummaryStats {
  totalCases: number;
  totalFacilities: number;
  totalLgas: number;
  totalWards: number;
  topLgas: LgaAggregate[];
  bottomLgas: LgaAggregate[];
}

const QGISFilterableMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);
  const dataLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const allFeaturesRef = useRef<any[]>([]);
  const valueModeRef = useRef<'cases' | 'incidence'>('cases');

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [valueMode, setValueMode] = useState<'cases' | 'incidence'>('cases');

  // Available metrics (fetched from API)
  const metrics: MetricConfig[] = [
    {
      id: 'severe_malaria',
      name: 'Severe Malaria Cases',
      layerFile: '',
      description: 'Cases of severe malaria reported by health facilities'
    },
    {
      id: 'sickle_cell',
      name: 'Sickle Cell Cases',
      layerFile: '',
      description: 'Sickle cell disease cases reported by health facilities'
    },
    {
      id: 'breast_cancer',
      name: 'Breast Cancer Cases',
      layerFile: '',
      description: 'Breast cancer cases reported by health facilities'
    },
    {
      id: 'death_cases',
      name: 'Death Cases',
      layerFile: '',
      description: 'Death cases reported by health facilities'
    },
    {
      id: 'arthritis_suspected',
      name: 'Arthritis Cases (Suspected)',
      layerFile: '',
      description: 'New suspected arthritis cases reported by health facilities'
    },
    {
      id: 'deliveries_sba',
      name: 'Deliveries with Skilled Birth Attendant',
      layerFile: '',
      description: 'Deliveries attended by skilled birth attendants'
    },
    {
      id: 'elephantiasis',
      name: 'Elephantiasis Cases',
      layerFile: '',
      description: 'New elephantiasis cases reported by health facilities'
    },
    {
      id: 'hepc_tested',
      name: 'Hepatitis C Tests',
      layerFile: '',
      description: 'Number of Hepatitis C tests conducted'
    },
    {
      id: 'measles_under_5',
      name: 'Measles Cases (Under 5)',
      layerFile: '',
      description: 'New measles cases in children under 5 years'
    },
    {
      id: 'patients_admitted',
      name: 'Patients Admitted',
      layerFile: '',
      description: 'Total number of patients admitted to health facilities'
    },
    {
      id: 'yellow_fever_vaccination',
      name: 'Yellow Fever Vaccinations',
      layerFile: '',
      description: 'Yellow fever vaccinations administered'
    }
  ];

  // API Configuration - Use the full URL including /api
  const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://api.anamgeohub.octaveanalytics.com/api';
  
  console.log('DEBUG - VITE_API_BASE:', import.meta.env.VITE_API_BASE);
  console.log('DEBUG - API_BASE_URL:', API_BASE_URL);

  const currentMetric = metrics.find(m => m.id === filters.metric) || metrics[0];

  useEffect(() => {
    valueModeRef.current = valueMode;
    if (dataLayerRef.current) {
      dataLayerRef.current.changed();
    }
  }, [valueMode]);

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
        const mode = valueModeRef.current;
        const rawValue = mode === 'incidence'
          ? feature.get('incidence_per_1000') || 0
          : feature.get('case_count') || 0;
        const value = Number(rawValue) || 0;
        // Size based on case count
        const radius = Math.min(Math.max(value / 10, 5), 20);
        const label = value > 0
          ? (mode === 'incidence' ? value.toFixed(1) : value.toString())
          : '';
        return new Style({
          image: new Circle({
            radius: radius,
            fill: new Fill({ color: 'rgba(255, 0, 0, 0.6)' }),
            stroke: new Stroke({ color: '#8B0000', width: 2 })
          }),
          text: new Text({
            text: label,
            font: '12px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 })
          })
        });
      },
      zIndex: 2
    });
    dataLayerRef.current = dataLayer;

    const map = new OlMap({
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
          const incidence = feature.get('incidence_per_1000');
          const population = feature.get('population');
          const incidenceText = typeof incidence === 'number' ? incidence.toFixed(1) : 'N/A';
          const populationText = typeof population === 'number' ? population.toLocaleString() : 'N/A';
          overlay.setPosition(coords);
          popupElement.innerHTML = `
            <div class="p-4 bg-white rounded-lg shadow-lg max-w-[90vw] md:max-w-xl relative">
              <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onclick="this.parentElement.style.display='none'">×</button>
              <h3 class="font-bold text-lg mb-2">${feature.get('facility_name') || 'Unknown Facility'}</h3>
              <p class="text-sm text-gray-600"><strong>LGA:</strong> ${feature.get('lga_name') || 'N/A'}</p>
              <p class="text-sm text-gray-600"><strong>Ward:</strong> ${feature.get('parentwardname') || 'N/A'}</p>
              <p class="text-sm text-gray-600"><strong>Period:</strong> ${feature.get('period') || 'N/A'}</p>
              <p class="text-sm text-red-600 font-bold mt-2"><strong>Cases:</strong> ${feature.get('case_count') || 0}</p>
              <p class="text-sm text-gray-600"><strong>Incidence (per 1,000):</strong> ${incidenceText}</p>
              <p class="text-sm text-gray-600"><strong>LGA population:</strong> ${populationText}</p>
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

  const authenticatedFetch = useAuthenticatedFetch();

  // Load metric data from API
  const loadMetricData = async () => {
    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/health-metrics/${filters.metric}`;
      console.log('🔍 DEBUG - Full API URL:', apiUrl);
      
      const response = await authenticatedFetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const geojson = await response.json();

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
      
      // Set default period to the last (most recent) period if not already set
      if (uniquePeriods.length > 0 && !filters.period) {
        const lastPeriod = uniquePeriods[uniquePeriods.length - 1];
        setFilters(prev => ({ ...prev, period: lastPeriod as string }));
      }
      
      // Apply initial filter
      applyFilters(features);
    } catch (error) {
      console.error('Error loading metric data:', error);
      // Show error message to user
      alert('Failed to load health metrics data. Please check if the backend server is running and authorization is configured.');
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

  const computeSummary = (features: any[]): SummaryStats => {
    let totalCases = 0;
    const lgaMap = new Map<string, { totalCases: number; facilities: number }>();
    const wardSet = new Set<string>();

    for (const feature of features) {
      const lgaName = feature.get('lga_name') || 'Unknown';
      const wardName = feature.get('parentwardname');
      const cases = Number(feature.get('case_count') || 0);

      totalCases += cases;

      if (wardName) {
        wardSet.add(wardName);
      }

      const existing = lgaMap.get(lgaName) || { totalCases: 0, facilities: 0 };
      existing.totalCases += cases;
      existing.facilities += 1;
      lgaMap.set(lgaName, existing);
    }

    const aggregates: LgaAggregate[] = Array.from(lgaMap.entries()).map(([lga, value]) => ({
      lga,
      totalCases: value.totalCases,
      facilities: value.facilities,
    }));

    const nonZeroAggregates = aggregates.filter(a => a.totalCases > 0);

    const topLgas = [...nonZeroAggregates]
      .sort((a, b) => b.totalCases - a.totalCases)
      .slice(0, 5);

    const bottomLgas = [...nonZeroAggregates]
      .sort((a, b) => a.totalCases - b.totalCases)
      .slice(0, 5);

    return {
      totalCases,
      totalFacilities: features.length,
      totalLgas: aggregates.length,
      totalWards: wardSet.size,
      topLgas,
      bottomLgas,
    };
  };

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

    setSummary(filtered.length > 0 ? computeSummary(filtered) : null);
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

  // Filters block reused for desktop and mobile
  const FiltersBlock = (
    <>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-2">Health Metrics Map</h2>
        <p className="text-sm text-gray-600">
          Showing {filteredCount} of {allFeaturesRef.current.length} records
        </p>
      </div>
      <div className="p-4 space-y-4">
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

        <div>
          <label className="block text-sm font-medium mb-1">Value Type</label>
          <select
            value={valueMode}
            onChange={(e) => setValueMode(e.target.value as 'cases' | 'incidence')}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="cases">Cases</option>
            <option value="incidence">Incidence per 1,000 (LGA population)</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading data...</p>
          </div>
        )}

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

        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>Case location (size = case count)</span>
            </div>
          </div>
        </div>

        {summary && (
          <div className="border-t pt-4 mt-4 space-y-3">
            <h3 className="font-medium mb-2">Burden Summary</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Total cases</p>
                <p className="text-base font-semibold">{summary.totalCases.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Facilities</p>
                <p className="text-base font-semibold">{summary.totalFacilities.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">LGAs</p>
                <p className="text-base font-semibold">{summary.totalLgas}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Wards</p>
                <p className="text-base font-semibold">{summary.totalWards}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-medium mb-1">Top 5 LGAs</p>
                <ul className="space-y-1">
                  {summary.topLgas.map(item => (
                    <li key={item.lga} className="flex justify-between">
                      <span className="truncate">{item.lga}</span>
                      <span className="font-semibold">{item.totalCases}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">Bottom 5 LGAs</p>
                <ul className="space-y-1">
                  {summary.bottomLgas.map(item => (
                    <li key={item.lga} className="flex justify-between">
                      <span className="truncate">{item.lga}</span>
                      <span className="font-semibold">{item.totalCases}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="relative h-full">
      {/* Filter toggle button - visible on all screen sizes */}
      <button
        type="button"
        className="absolute top-3 left-12 z-[1100] px-3 py-2 bg-white rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        onClick={() => setMobileFiltersOpen(v => !v)}
      >
        {mobileFiltersOpen ? '✕ Close Filters' : '☰ Open Filters'}
      </button>

      {/* Filter panel - shows as overlay when toggle is active */}
      {mobileFiltersOpen && (
        <div className="absolute z-[1050] bg-white border rounded-lg shadow-lg overflow-y-auto inset-x-4 top-14 max-h-[80vh] md:top-4 md:left-4 md:inset-x-auto md:w-80 md:max-h-[85vh] md:mt-12">
          {FiltersBlock}
        </div>
      )}

      {/* Map Container */}
      <div className="w-full h-full">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default QGISFilterableMap;
