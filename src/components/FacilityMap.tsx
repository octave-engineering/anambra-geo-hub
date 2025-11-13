import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  lga_name: string;
}

interface Stats {
  total_facilities: number;
  total_lgas: number;
  total_wards: number;
  facilities_with_coords: number;
}

const FacilityMap: React.FC = () => {
  const authenticatedFetch = useAuthenticatedFetch();
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const overlayRef = useRef<Overlay | null>(null);

  const [lgas, setLgas] = useState<LGA[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [stats, setStats] = useState<Stats | null>({
    total_facilities: 0,
    facilities_with_coords: 0,
    total_lgas: 0,
    total_wards: 0
  });
  const [filtersVisible, setFiltersVisible] = useState(true);
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

    // Anambra State boundary layer
    const boundarySource = new VectorSource();
    const boundaryLayer = new VectorLayer({
      source: boundarySource,
      style: new Style({
        stroke: new Stroke({
          color: '#333',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(200, 200, 200, 0.1)'
        })
      }),
      zIndex: 1
    });

    // Facilities layer
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
      },
      zIndex: 2
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        boundaryLayer,
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([7.0, 6.2]), // Anambra State coordinates
        zoom: 9
      })
    });

    // Load Anambra State boundary
    const loadBoundary = async () => {
      try {
        const response = await fetch('/qgis-maps/qgis_export/layers/Anambra_State_1.js');
        const text = await response.text();
        const jsonMatch = text.match(/var\s+json_[^\s]+\s*=\s*(\{.+\});?$/);
        if (jsonMatch) {
          const geojson = JSON.parse(jsonMatch[1]);
          const features = new GeoJSON().readFeatures(geojson, {
            featureProjection: 'EPSG:3857'
          });
          boundarySource.addFeatures(features);
        }
      } catch (error) {
        console.error('Error loading boundary:', error);
      }
    };
    loadBoundary();

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
                <div class="relative p-4 bg-white rounded-lg shadow-lg max-w-[90vw] md:max-w-xl">
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

  // Function declarations first

  const fetchLGAs = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/facilities/lgas`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ LGA fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch LGAs: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setLgas(data);
      } else {
        setLgas([]);
      }
    } catch (error) {
      console.error('💥 Error fetching LGAs:', error);
      setLgas([]);
    }
  }, [authenticatedFetch]);

  const fetchWards = useCallback(async (lga: string) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/facilities/wards?lga=${encodeURIComponent(lga)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch wards: ${response.status}`);
      }
      const data = await response.json();
      setWards(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  }, [authenticatedFetch]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/facilities/stats`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [authenticatedFetch]);

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.lga) params.append('lga', filters.lga);
      if (filters.ward) params.append('ward', filters.ward);
      if (filters.facilityType) params.append('facility_type', filters.facilityType);
      if (filters.search) params.append('search', filters.search);

      const url = `${API_BASE}/facilities?${params}`;

      const response = await authenticatedFetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch facilities: ${response.status} ${response.statusText}`);
      }
      
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
  }, [filters, authenticatedFetch]);

  // useEffects after function declarations
  // Fetch initial data
  useEffect(() => {
    fetchLGAs();
    fetchStats();
    fetchFacilities();
  }, []); // Empty dependency array for initial load

  // Fetch facilities when filters change
  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  // Fetch wards when LGA changes
  useEffect(() => {
    if (filters.lga) {
      fetchWards(filters.lga);
    } else {
      setWards([]);
      setFilters(prev => ({ ...prev, ward: '' }));
    }
  }, [filters.lga, fetchWards]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        // Reset ward if LGA changes
        ...(key === 'lga' && value !== prev.lga ? { ward: '' } : {})
      };
      return newFilters;
    });
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
      {/* Filter Toggle Button */}
      <button
        onClick={() => setFiltersVisible(!filtersVisible)}
        className="absolute top-4 left-12 z-20 px-3 py-2 bg-white rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        {filtersVisible ? '✕ Close Filters' : '☰ Open Filters'}
      </button>

      {/* Filter Panel */}
      {filtersVisible && (
      <div className="absolute z-10 bg-white rounded-lg shadow-lg p-4 space-y-4 inset-x-4 top-16 md:top-4 md:left-4 w-[calc(100vw-2rem)] md:w-auto max-w-[calc(100vw-2rem)] md:max-w-sm md:mt-12">
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
              <option value="">All LGAs </option>
              {lgas.length > 0 ? (
                lgas.map((lga) => {
                  return (
                    <option key={lga.lga_id} value={lga.lga_name}>
                      {lga.lga_name}
                    </option>
                  );
                })
              ) : (
                <option disabled>Loading LGAs...</option>
              )}
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
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Popup */}
      <div 
        ref={popupRef} 
        className="ol-popup absolute bg-white rounded-lg shadow-xl"
        style={{ display: 'none', width: '300px'}}
      />
    </div>
  );
};

export default FacilityMap;
