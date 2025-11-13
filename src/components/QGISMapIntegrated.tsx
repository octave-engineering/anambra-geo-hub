import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import 'ol/ol.css';

interface FilterState {
  lga: string;
  ward: string;
  facilityType: string;
  search: string;
}

interface LGA {
  lga_id: string;
  lga_name: string;
}

interface Ward {
  ward_id: string;
  ward_name: string;
}

const QGISMapIntegrated = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const mapRef = useRef<HTMLDivElement>(null);
  const qgisMapRef = useRef<HTMLIFrameElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const popupElementRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    lga: '',
    ward: '',
    facilityType: '',
    search: ''
  });

  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [stats, setStats] = useState({ total_facilities: 0, facilities_with_coords: 0 });
  const [viewMode, setViewMode] = useState<'openlayers' | 'qgis'>('openlayers');

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';

  // Fetch LGAs
  useEffect(() => {
    const fetchLGAs = async () => {
      try {
        const response = await authenticatedFetch(`${API_BASE}/facilities/lgas`);
        if (!response.ok) {
          throw new Error(`Failed to fetch LGAs: ${response.status}`);
        }
        const data = await response.json();
        setLgas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching LGAs:', err);
      }
    };
    fetchLGAs();
  }, []);

  // Fetch wards when LGA changes
  useEffect(() => {
    if (filters.lga) {
      const fetchWards = async () => {
        try {
          const response = await authenticatedFetch(`${API_BASE}/facilities/wards?lga=${encodeURIComponent(filters.lga)}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch wards: ${response.status}`);
          }
          const data = await response.json();
          setWards(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error fetching wards:', err);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [filters.lga]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await authenticatedFetch(`${API_BASE}/facilities/stats`);
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // Initialize OpenLayers map with QGIS layers + database overlay
  useEffect(() => {
    if (!mapRef.current || viewMode !== 'openlayers') return;

    // Base layer
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    // Database facilities layer
    const facilitiesSource = new VectorSource();
    const facilitiesLayer = new VectorLayer({
      source: facilitiesSource,
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({ color: '#3b82f6' }),
          stroke: new Stroke({ color: '#1e40af', width: 2 })
        })
      })
    });

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, facilitiesLayer],
      view: new View({
        center: fromLonLat([7.0, 6.2]), // Anambra State center
        zoom: 9
      })
    });

    // Create popup element outside React's control
    const popupElement = document.createElement('div');
    popupElement.className = 'ol-popup';
    popupElementRef.current = popupElement;

    // Popup overlay
    const overlay = new Overlay({
      element: popupElement,
      autoPan: {
        animation: { duration: 250 }
      }
    });
    map.addOverlay(overlay);
    overlayRef.current = overlay;

    // Click handler for popups
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coords = geometry.getCoordinates();
          overlay.setPosition(coords);
          const props = feature.getProperties();
          popupElement.innerHTML = `
            <div class="p-4 bg-white rounded-lg shadow-lg max-w-sm">
              <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onclick="this.style.display='none'">×</button>
              <h3 class="font-bold text-lg mb-2">${props.facility_name}</h3>
              <p class="text-sm text-gray-600"><strong>LGA:</strong> ${props.lga_name}</p>
              <p class="text-sm text-gray-600"><strong>Ward:</strong> ${props.ward_name}</p>
            </div>
          `;
          popupElement.style.display = 'block';
        }
      } else {
        popupElement.style.display = 'none';
      }
    });

    mapInstanceRef.current = map;

    // Fetch facilities
    fetchFacilities(facilitiesSource, map);

    return () => {
      // Proper cleanup
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
  }, [viewMode]);

  // Update facilities when filters change
  useEffect(() => {
    if (mapInstanceRef.current && viewMode === 'openlayers') {
      const facilitiesLayer = mapInstanceRef.current.getAllLayers()[1] as VectorLayer<VectorSource>;
      if (facilitiesLayer) {
        fetchFacilities(facilitiesLayer.getSource()!, mapInstanceRef.current);
      }
    }
  }, [filters]);

  const fetchFacilities = async (source: VectorSource, map: Map) => {
    try {
      const params = new URLSearchParams();
      if (filters.lga) params.append('lga', filters.lga);
      if (filters.ward) params.append('ward', filters.ward);
      if (filters.facilityType) params.append('facility_type', filters.facilityType);
      if (filters.search) params.append('search', filters.search);

      const response = await authenticatedFetch(`${API_BASE}/facilities?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch facilities: ${response.status}`);
      }
      const geojson = await response.json();

      source.clear();
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });
      source.addFeatures(features);

      // Auto-zoom to features
      if (features.length > 0) {
        const extent = source.getExtent();
        map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 12 });
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // Reset ward when LGA changes
      if (key === 'lga') updated.ward = '';
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({ lga: '', ward: '', facilityType: '', search: '' });
  };

  return (
    <div className="flex h-full">
      {/* Sidebar - Filters */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-2">GIS Mapping</h2>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('openlayers')}
              className={`flex-1 px-3 py-2 text-sm rounded ${
                viewMode === 'openlayers' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setViewMode('qgis')}
              className={`flex-1 px-3 py-2 text-sm rounded ${
                viewMode === 'qgis' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              QGIS Export
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {stats.facilities_with_coords} of {stats.total_facilities} facilities mapped
          </p>
        </div>

        {viewMode === 'openlayers' && (
          <div className="p-4 space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                placeholder="Search facilities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
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
                  <option key={lga.lga_id} value={lga.lga_name}>{lga.lga_name}</option>
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
                  <option key={ward.ward_id} value={ward.ward_name}>{ward.ward_name}</option>
                ))}
              </select>
            </div>

            {/* Facility Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Facility Type</label>
              <select
                value={filters.facilityType}
                onChange={(e) => handleFilterChange('facilityType', e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Primary Health Centre">Primary Health Centre</option>
                <option value="Health Post">Health Post</option>
                <option value="Comprehensive Health Centre">Comprehensive Health Centre</option>
                <option value="Clinic">Clinic</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {viewMode === 'qgis' && (
          <div className="p-4">
            <p className="text-sm text-gray-600">
              Viewing exported QGIS map. Switch to Interactive Map to use filters.
            </p>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {viewMode === 'openlayers' ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          <iframe
            ref={qgisMapRef}
            src="/qgis-maps/qgis_export/index.html"
            className="w-full h-full border-0"
            title="QGIS Exported Map"
          />
        )}
      </div>
    </div>
  );
};

export default QGISMapIntegrated;
