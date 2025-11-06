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
  lga_name: string;
}

interface Stats {
  total_facilities: number;
  total_lgas: number;
  total_wards: number;
  facilities_with_coords: number;
}

const FacilityMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const overlayRef = useRef<Overlay | null>(null);

  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    lga: '',
    ward: '',
    facilityType: '',
    search: ''
  });

  const API_BASE = 'http://localhost:3001/api';

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: (feature) => {
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: '#3b82f6' }),
            stroke: new Stroke({ color: '#fff', width: 2 })
          }),
          text: new Text({
            text: feature.get('facility_name'),
            offsetY: -15,
            font: '12px sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 })
          })
        });
      }
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([7.0, 6.2]), // Anambra State coordinates
        zoom: 9
      })
    });

    // Create popup overlay
    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: {
          animation: {
            duration: 250
          }
        }
      });
      map.addOverlay(overlay);
      overlayRef.current = overlay;

      // Handle click events
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
        if (feature) {
          const geometry = feature.getGeometry();
          if (geometry instanceof Point) {
            const coords = geometry.getCoordinates();
            overlay.setPosition(coords);
            if (popupRef.current) {
              popupRef.current.style.display = 'block';
              const props = feature.getProperties();
              popupRef.current.innerHTML = `
                <div class="p-4 bg-white rounded-lg shadow-lg max-w-sm">
                  <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.style.display='none'">×</button>
                  <h3 class="font-bold text-lg mb-2">${props.facility_name}</h3>
                  <p class="text-sm text-gray-600"><strong>LGA:</strong> ${props.lga_name}</p>
                  <p class="text-sm text-gray-600"><strong>Ward:</strong> ${props.ward_name}</p>
                  <p class="text-sm text-gray-600"><strong>ID:</strong> ${props.facility_id}</p>
                </div>
              `;
            }
          }
        } else {
          overlay.setPosition(undefined);
        }
      });

      // Change cursor on hover
      map.on('pointermove', (evt) => {
        const pixel = map.getEventPixel(evt.originalEvent);
        const hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchLGAs();
    fetchStats();
    fetchFacilities();
  }, []);

  // Fetch facilities when filters change
  useEffect(() => {
    fetchFacilities();
  }, [filters]);

  // Fetch wards when LGA changes
  useEffect(() => {
    if (filters.lga) {
      fetchWards(filters.lga);
    } else {
      setWards([]);
      setFilters(prev => ({ ...prev, ward: '' }));
    }
  }, [filters.lga]);

  const fetchLGAs = async () => {
    try {
      const response = await fetch(`${API_BASE}/lgas`);
      const data = await response.json();
      setLgas(data);
    } catch (error) {
      console.error('Error fetching LGAs:', error);
    }
  };

  const fetchWards = async (lga: string) => {
    try {
      const response = await fetch(`${API_BASE}/wards?lga=${encodeURIComponent(lga)}`);
      const data = await response.json();
      setWards(data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.lga) params.append('lga', filters.lga);
      if (filters.ward) params.append('ward', filters.ward);
      if (filters.facilityType) params.append('facility_type', filters.facilityType);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`${API_BASE}/facilities?${params}`);
      const geojson = await response.json();

      // Update vector source
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });

      vectorSourceRef.current.clear();
      vectorSourceRef.current.addFeatures(features);

      // Zoom to extent of features if any
      if (features.length > 0 && mapInstanceRef.current) {
        const extent = vectorSourceRef.current.getExtent();
        mapInstanceRef.current.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 15
        });
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset ward if LGA changes
      ...(key === 'lga' && value !== prev.lga ? { ward: '' } : {})
    }));
  };

  const resetFilters = () => {
    setFilters({
      lga: '',
      ward: '',
      facilityType: '',
      search: ''
    });
  };

  return (
    <div className="relative w-full h-screen">
      {/* Filter Panel */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-4">Health Facility Map</h2>
          
          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <div className="font-semibold text-blue-700">{stats.total_facilities}</div>
                <div className="text-gray-600">Facilities</div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="font-semibold text-green-700">{stats.facilities_with_coords}</div>
                <div className="text-gray-600">Mapped</div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search facilities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LGA Filter */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Local Government Area
            </label>
            <select
              value={filters.lga}
              onChange={(e) => handleFilterChange('lga', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All LGAs</option>
              {lgas.map((lga) => (
                <option key={lga.lga_id} value={lga.lga_name}>
                  {lga.lga_name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Filter */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ward
            </label>
            <select
              value={filters.ward}
              onChange={(e) => handleFilterChange('ward', e.target.value)}
              disabled={!filters.lga || wards.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Wards</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_name}>
                  {ward.ward_name}
                </option>
              ))}
            </select>
          </div>

          {/* Facility Type Filter */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facility Type
            </label>
            <select
              value={filters.facilityType}
              onChange={(e) => handleFilterChange('facilityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Primary Health Centre">Primary Health Centre</option>
              <option value="Health Post">Health Post</option>
              <option value="Model Primary">Model Primary</option>
              <option value="Maternal">Maternal & Child Health</option>
              <option value="Maternity">Maternity</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
          >
            Reset Filters
          </button>

          {loading && (
            <div className="mt-3 text-center text-sm text-gray-600">
              Loading facilities...
            </div>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Popup */}
      <div 
        ref={popupRef} 
        className="ol-popup absolute bg-white rounded-lg shadow-xl"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FacilityMap;
