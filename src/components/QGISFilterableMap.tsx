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

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface FilterState {
  lga: string;
  ward: string;
  period: string;
  metric: string;
  minIncidence: string;
  maxIncidence: string;
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
  const compareLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const secondaryMapRef = useRef<HTMLDivElement | null>(null);
  const secondaryMapInstanceRef = useRef<OlMap | null>(null);
  const secondaryDataLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const allFeaturesRef = useRef<any[]>([]);
  const compareFeaturesRef = useRef<any[]>([]);
  const valueModeRef = useRef<'cases' | 'incidence'>('cases');

  const [filters, setFilters] = useState<FilterState>({
    lga: '',
    ward: '',
    period: '',
    metric: 'severe_malaria',
    minIncidence: '',
    maxIncidence: ''
  });

  const [lgas, setLgas] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [secondarySummary, setSecondarySummary] = useState<SummaryStats | null>(null);
  const [valueMode, setValueMode] = useState<'cases' | 'incidence'>('cases');
  const [statePopulation, setStatePopulation] = useState<number | null>(null);
  const [selectedLga, setSelectedLga] = useState<string | null>(null);
  const [selectedLgaPopulation, setSelectedLgaPopulation] = useState<number | null>(null);

  const [timeChartMode, setTimeChartMode] = useState<'year' | 'month'>('year');
  const [chartSelectedYear, setChartSelectedYear] = useState<number | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [secondaryMetricId, setSecondaryMetricId] = useState<string>('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'split'>('single');

  // GRID3 layer state
  const [grid3Layers, setGrid3Layers] = useState<{[key: string]: boolean}>({
    population: false,
    settlements: false,
    facility_access: false
  });
  const [grid3Data, setGrid3Data] = useState<{[key: string]: any}>({});
  const grid3LayerRefs = useRef<{[key: string]: VectorLayer<VectorSource>}>({});

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

  const currentMetric = metrics.find(m => m.id === filters.metric) || metrics[0];
  const secondaryMetric = secondaryMetricId
    ? metrics.find(m => m.id === secondaryMetricId) || null
    : null;

  const currentPeriod = filters.period || '';
  const selectedYear = currentPeriod.length >= 4 ? currentPeriod.slice(0, 4) : '';
  const selectedMonth = currentPeriod.length >= 6 ? currentPeriod.slice(4, 6) : '';

  const yearOptions = Array.from(
    new Set(
      periods
        .map(p => String(p).slice(0, 4))
        .filter(y => y && y.length === 4)
    )
  ).sort();

  const monthOptions = MONTH_LABELS.map((label, index) => {
    const value = String(index + 1).padStart(2, '0');
    return { value, label };
  });

  const formatPopulation = (value: number | null | undefined): string => {
    if (value == null || !Number.isFinite(value)) return 'N/A';
    const n = Math.round(value);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
    if (n >= 1_000) return `${Math.round(n / 1000)}k`;
    return n.toLocaleString();
  };

  useEffect(() => {
    valueModeRef.current = valueMode;
    if (dataLayerRef.current) {
      dataLayerRef.current.changed();
    }
    if (compareLayerRef.current) {
      compareLayerRef.current.changed();
    }
    if (secondaryDataLayerRef.current) {
      secondaryDataLayerRef.current.changed();
    }
  }, [valueMode]);

  // Default overlays: open on desktop (md and up), closed on small screens
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDesktop = window.innerWidth >= 768; // Tailwind md breakpoint
    setSummaryOpen(isDesktop);
    setChartOpen(isDesktop);
  }, []);

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
        // Size based on selected value type
        const radius = Math.min(Math.max(value / 8, 6), 26);
        const label = value > 0
          ? (mode === 'incidence' ? value.toFixed(2) : value.toString())
          : '';
        return new Style({
          image: new Circle({
            radius: radius,
            fill: new Fill({ color: 'rgba(239, 68, 68, 0.7)' }),
            stroke: new Stroke({ color: '#7f1d1d', width: 2 })
          }),
          text: new Text({
            text: label,
            font: '12px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 })
          })
        });
      },
      zIndex: 3
    });
    dataLayerRef.current = dataLayer;

    // Secondary comparison layer (blue styling)
    const compareSource = new VectorSource();
    const compareLayer = new VectorLayer({
      source: compareSource,
      style: (feature) => {
        const mode = valueModeRef.current;
        const rawValue = mode === 'incidence'
          ? feature.get('incidence_per_1000') || 0
          : feature.get('case_count') || 0;
        const value = Number(rawValue) || 0;
        const radius = Math.min(Math.max(value / 8, 6), 26);
        const label = value > 0
          ? (mode === 'incidence' ? value.toFixed(2) : value.toString())
          : '';
        return new Style({
          image: new Circle({
            radius,
            fill: new Fill({ color: 'rgba(37, 99, 235, 0.6)' }),
            stroke: new Stroke({ color: '#1d4ed8', width: 2 })
          }),
          text: new Text({
            text: label,
            font: '11px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 })
          })
        });
      },
      zIndex: 2
    });
    compareLayerRef.current = compareLayer;

    const map = new OlMap({
      target: mapRef.current,
      layers: [baseLayer, boundaryLayer, dataLayer, compareLayer],
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
          const incidenceRaw = feature.get('incidence_per_1000');
          const populationRaw = feature.get('population');
          const incidenceValue =
            incidenceRaw !== undefined && incidenceRaw !== null
              ? Number(incidenceRaw)
              : NaN;
          const populationValue =
            populationRaw !== undefined && populationRaw !== null
              ? Number(populationRaw)
              : NaN;
          const lgaName = feature.get('lga_name') || null;
          const incidenceText = !Number.isNaN(incidenceValue)
            ? incidenceValue.toFixed(2)
            : 'N/A';
          const populationText = !Number.isNaN(populationValue)
            ? populationValue.toLocaleString()
            : 'N/A';
          setSelectedLga(lgaName);
          setSelectedLgaPopulation(!Number.isNaN(populationValue) ? populationValue : null);
          
          // Get GRID3 data for this LGA if available
          let grid3Info = '';
          if (lgaName && Object.values(grid3Layers).some(v => v)) {
            const grid3Sections = [];
            
            // Population data
            if (grid3Layers.population && grid3Data.population) {
              const lgaPopFeature = grid3Data.population.find((f: any) => 
                f.get('lga_name') === lgaName
              );
              if (lgaPopFeature) {
                const totalPop = lgaPopFeature.get('total_population');
                const malePop = lgaPopFeature.get('male_population');
                const femalePop = lgaPopFeature.get('female_population');
                grid3Sections.push(`
                  <div class="mt-3 pt-3 border-t">
                    <p class="text-xs font-semibold text-blue-700 mb-1">GRID3 Population Data</p>
                    <p class="text-xs text-gray-600">Total: ${totalPop?.toLocaleString() || 'N/A'}</p>
                    <p class="text-xs text-gray-600">Male: ${malePop?.toLocaleString() || 'N/A'} | Female: ${femalePop?.toLocaleString() || 'N/A'}</p>
                  </div>
                `);
              }
            }
            
            // Facility access data
            if (grid3Layers.facility_access && grid3Data.facility_access) {
              const accessFeature = grid3Data.facility_access.find((f: any) =>
                f.get('lga_name') === lgaName
              );
              if (accessFeature) {
                const travelTime = accessFeature.get('avg_travel_time');
                grid3Sections.push(`
                  <div class="mt-2">
                    <p class="text-xs font-semibold text-green-700 mb-1">Facility Access</p>
                    <p class="text-xs text-gray-600">Avg travel time: ${travelTime ? Math.round(travelTime) : 'N/A'} min</p>
                  </div>
                `);
              }
            }
            
            grid3Info = grid3Sections.join('');
          }
          
          // Ensure overlay is attached to the primary map when showing the popup
          overlay.setMap(map);
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
              ${grid3Info}
            </div>
          `;
          popupElement.style.display = 'block';
        }
      } else {
        popupElement.style.display = 'none';
        setSelectedLga(null);
        setSelectedLgaPopulation(null);
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

  // Load metric data from API (primary metric)
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

      // Compute total state population from unique LGA populations
      const lgaPopMap = new Map<string, number>();
      for (const f of features) {
        const lgaName = f.get('lga_name');
        const popRaw = f.get('population');
        const popVal =
          popRaw !== undefined && popRaw !== null
            ? Number(popRaw)
            : NaN;
        if (!lgaName || Number.isNaN(popVal)) continue;
        if (!lgaPopMap.has(lgaName)) {
          lgaPopMap.set(lgaName, popVal);
        }
      }
      const totalPop = Array.from(lgaPopMap.values()).reduce((acc, val) => acc + val, 0);
      setStatePopulation(totalPop || null);
      
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

  // Load secondary metric data for comparison
  const loadSecondaryMetricData = async (metricId: string) => {
    setCompareLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/health-metrics/${metricId}`;
      const response = await authenticatedFetch(apiUrl);

      if (!response.ok) {
        throw new Error(`Secondary metric API request failed: ${response.status} ${response.statusText}`);
      }

      const geojson = await response.json();
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });

      compareFeaturesRef.current = features;
      applyCompareFilters(features);
    } catch (error) {
      console.error('Error loading secondary metric data:', error);
    } finally {
      setCompareLoading(false);
    }
  };

  // Load GRID3 layer data
  const loadGrid3Layer = async (layerId: string) => {
    try {
      const apiUrl = `${API_BASE_URL}/grid3/${layerId}`;
      const response = await authenticatedFetch(apiUrl);

      if (!response.ok) {
        console.error(`GRID3 ${layerId} API request failed: ${response.status}`);
        return;
      }

      const geojson = await response.json();
      
      // If layer is empty or error, skip
      if (!geojson.features || geojson.features.length === 0) {
        console.log(`No ${layerId} data available yet`);
        return;
      }

      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });

      setGrid3Data(prev => ({ ...prev, [layerId]: features }));
      
      // Add to map if layer doesn't exist
      if (!grid3LayerRefs.current[layerId]) {
        const vectorSource = new VectorSource({ features });
        const vectorLayer = new VectorLayer({
          source: vectorSource,
          style: getGrid3LayerStyle(layerId),
          zIndex: 5 // Above boundary, below data points
        });
        
        grid3LayerRefs.current[layerId] = vectorLayer;
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.addLayer(vectorLayer);
        }
        if (secondaryMapInstanceRef.current) {
          const vectorSource2 = new VectorSource({ features });
          const vectorLayer2 = new VectorLayer({
            source: vectorSource2,
            style: getGrid3LayerStyle(layerId),
            zIndex: 5
          });
          secondaryMapInstanceRef.current.addLayer(vectorLayer2);
        }
      }
    } catch (error) {
      console.error(`Error loading GRID3 ${layerId}:`, error);
    }
  };

  // Style function for GRID3 layers
  const getGrid3LayerStyle = (layerId: string) => {
    return (feature: any) => {
      if (layerId === 'population') {
        const pop = feature.get('total_population') || 0;
        const maxPop = 500000; // Adjust based on your data
        const opacity = Math.min(pop / maxPop, 0.7);
        return new Style({
          fill: new Fill({ color: `rgba(100, 149, 237, ${opacity})` }),
          stroke: new Stroke({ color: '#4169E1', width: 1 })
        });
      } else if (layerId === 'settlements') {
        return new Style({
          image: new Circle({
            radius: 4,
            fill: new Fill({ color: 'rgba(255, 140, 0, 0.6)' }),
            stroke: new Stroke({ color: '#FF8C00', width: 1 })
          })
        });
      } else if (layerId === 'facility_access') {
        const accessTime = feature.get('avg_travel_time') || 0;
        const color = accessTime > 60 ? 'rgba(220, 20, 60, 0.5)' : 'rgba(34, 139, 34, 0.5)';
        return new Style({
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#333', width: 1 })
        });
      }
      return new Style();
    };
  };

  // Toggle GRID3 layer on/off
  const toggleGrid3Layer = async (layerId: string, enabled: boolean) => {
    setGrid3Layers(prev => ({ ...prev, [layerId]: enabled }));

    if (enabled) {
      // Load data if not already loaded
      if (!grid3Data[layerId]) {
        await loadGrid3Layer(layerId);
      } else {
        // Show existing layer
        const layer = grid3LayerRefs.current[layerId];
        if (layer) {
          layer.setVisible(true);
        }
      }
    } else {
      // Hide layer
      const layer = grid3LayerRefs.current[layerId];
      if (layer) {
        layer.setVisible(false);
      }
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    if (allFeaturesRef.current.length > 0) {
      applyFilters(allFeaturesRef.current);
    }
    if (compareEnabled && compareFeaturesRef.current.length > 0) {
      applyCompareFilters(compareFeaturesRef.current);
    } else if (compareLayerRef.current) {
      const source = compareLayerRef.current.getSource();
      if (source) {
        source.clear();
      }
    }
  }, [filters.lga, filters.ward, filters.period, filters.minIncidence, filters.maxIncidence, valueMode, compareEnabled]);

  // Ensure comparison layer is cleared in split view (blue dots only on secondary map in that mode)
  useEffect(() => {
    if (viewMode === 'split' && compareLayerRef.current) {
      const source = compareLayerRef.current.getSource();
      if (source) source.clear();
    } else if (viewMode === 'single' && compareEnabled && compareFeaturesRef.current.length > 0) {
      applyCompareFilters(compareFeaturesRef.current);
    }
  }, [viewMode, compareEnabled]);

  useEffect(() => {
    if (!compareEnabled) {
      compareFeaturesRef.current = [];
      setSecondarySummary(null);
      if (compareLayerRef.current) {
        const source = compareLayerRef.current.getSource();
        if (source) {
          source.clear();
        }
      }
      return;
    }

    if (secondaryMetricId) {
      loadSecondaryMetricData(secondaryMetricId);
    } else {
      compareFeaturesRef.current = [];
      if (compareLayerRef.current) {
        const source = compareLayerRef.current.getSource();
        if (source) {
          source.clear();
        }
      }
    }
  }, [compareEnabled, secondaryMetricId]);

  // Initialize secondary map for split view
  useEffect(() => {
    if (viewMode !== 'split' || !compareEnabled || !secondaryMetricId) {
      if (secondaryMapInstanceRef.current) {
        secondaryMapInstanceRef.current.setTarget(undefined as any);
        secondaryMapInstanceRef.current.dispose();
        secondaryMapInstanceRef.current = null;
        secondaryDataLayerRef.current = null;
      }
      return;
    }

    if (!secondaryMapRef.current || secondaryMapInstanceRef.current) return;

    const baseLayer = new TileLayer({
      source: new OSM()
    });

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

    const dataSource = new VectorSource();
    const dataLayer = new VectorLayer({
      source: dataSource,
      style: (feature) => {
        const mode = valueModeRef.current;
        const rawValue = mode === 'incidence'
          ? feature.get('incidence_per_1000') || 0
          : feature.get('case_count') || 0;
        const value = Number(rawValue) || 0;
        const radius = Math.min(Math.max(value / 9, 5), 22);
        const label = value > 0
          ? (mode === 'incidence' ? value.toFixed(2) : value.toString())
          : '';
        return new Style({
          image: new Circle({
            radius,
            fill: new Fill({ color: 'rgba(37, 99, 235, 0.6)' }),
            stroke: new Stroke({ color: '#1d4ed8', width: 2 })
          }),
          text: new Text({
            text: label,
            font: '11px sans-serif',
            fill: new Fill({ color: '#fff' }),
            stroke: new Stroke({ color: '#000', width: 2 })
          })
        });
      },
      zIndex: 2
    });
    secondaryDataLayerRef.current = dataLayer;

    const primaryView = mapInstanceRef.current?.getView();
    const view = primaryView
      ? new View({ center: primaryView.getCenter(), zoom: primaryView.getZoom() })
      : new View({ center: fromLonLat([7.0, 6.2]), zoom: 9 });

    const secondaryMap = new OlMap({
      target: secondaryMapRef.current,
      layers: [baseLayer, boundaryLayer, dataLayer],
      view,
    });

    secondaryMapInstanceRef.current = secondaryMap;
    loadBoundary(boundarySource);

    const secondaryPopupElement = document.createElement('div');
    secondaryPopupElement.className = 'ol-popup';
    const secondaryOverlay = new Overlay({
      element: secondaryPopupElement,
      autoPan: { animation: { duration: 250 } }
    });
    secondaryMap.addOverlay(secondaryOverlay);

    // Click handler for secondary map
    secondaryMap.on('click', (evt) => {
      const feature = secondaryMap.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature && feature.get('case_count') !== undefined) {
        const geometry = feature.getGeometry();
        if (geometry instanceof Point) {
          const coords = geometry.getCoordinates();
          const incidenceRaw = feature.get('incidence_per_1000');
          const populationRaw = feature.get('population');
          const incidenceValue =
            incidenceRaw !== undefined && incidenceRaw !== null
              ? Number(incidenceRaw)
              : NaN;
          const populationValue =
            populationRaw !== undefined && populationRaw !== null
              ? Number(populationRaw)
              : NaN;
          const lgaName = feature.get('lga_name') || null;
          const incidenceText = !Number.isNaN(incidenceValue)
            ? incidenceValue.toFixed(2)
            : 'N/A';
          const populationText = !Number.isNaN(populationValue)
            ? populationValue.toLocaleString()
            : 'N/A';
          setSelectedLga(lgaName);
          setSelectedLgaPopulation(!Number.isNaN(populationValue) ? populationValue : null);
          secondaryOverlay.setPosition(coords);
          secondaryPopupElement.innerHTML = `
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
          secondaryPopupElement.style.display = 'block';
        }
      } else {
        secondaryPopupElement.style.display = 'none';
        setSelectedLga(null);
        setSelectedLgaPopulation(null);
      }
    });

    if (compareFeaturesRef.current.length > 0) {
      applyCompareFilters(compareFeaturesRef.current);
    }
  }, [viewMode, compareEnabled, secondaryMetricId]);

  // Synchronize views between primary and secondary maps in split mode
  const isSyncingViewRef = useRef(false);
  useEffect(() => {
    if (viewMode !== 'split' || !compareEnabled || !secondaryMetricId) return;
    const primary = mapInstanceRef.current;
    const secondary = secondaryMapInstanceRef.current;
    if (!primary || !secondary) return;

    const handlePrimaryMove = () => {
      if (isSyncingViewRef.current) return;
      isSyncingViewRef.current = true;
      const view = primary.getView();
      secondary.getView().setCenter(view.getCenter());
      secondary.getView().setZoom(view.getZoom());
      isSyncingViewRef.current = false;
    };

    const handleSecondaryMove = () => {
      if (isSyncingViewRef.current) return;
      isSyncingViewRef.current = true;
      const view = secondary.getView();
      primary.getView().setCenter(view.getCenter());
      primary.getView().setZoom(view.getZoom());
      isSyncingViewRef.current = false;
    };

    primary.on('moveend', handlePrimaryMove);
    secondary.on('moveend', handleSecondaryMove);

    return () => {
      primary.un('moveend', handlePrimaryMove);
      secondary.un('moveend', handleSecondaryMove);
    };
  }, [viewMode, compareEnabled, secondaryMetricId]);

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
    const lgaMap = new Map<string, { totalCases: number; facilityIds: Set<string> }>();
    const wardSet = new Set<string>();
    const facilitySet = new Set<string>();

    for (const feature of features) {
      const lgaName = feature.get('lga_name') || 'Unknown';
      const wardName = feature.get('parentwardname');
      const cases = Number(feature.get('case_count') || 0);
      const facilityId = feature.get('facility_id') || feature.get('facility_name') || '';

      totalCases += cases;

      if (wardName) {
        wardSet.add(wardName);
      }

      if (facilityId) {
        facilitySet.add(String(facilityId));
      }

      const existing = lgaMap.get(lgaName) || { totalCases: 0, facilityIds: new Set<string>() };
      existing.totalCases += cases;
      if (facilityId) {
        existing.facilityIds.add(String(facilityId));
      }
      lgaMap.set(lgaName, existing);
    }

    const aggregates: LgaAggregate[] = Array.from(lgaMap.entries()).map(([lga, value]) => ({
      lga,
      totalCases: value.totalCases,
      facilities: value.facilityIds.size,
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
      totalFacilities: facilitySet.size,
      totalLgas: aggregates.length,
      totalWards: wardSet.size,
      topLgas,
      bottomLgas,
    };
  };

  const applyFilters = (features: any[]) => {
    if (!dataLayerRef.current) return;

    let filtered = features;

    const numericField = valueMode === 'incidence' ? 'incidence_per_1000' : 'case_count';

    if (filters.lga) {
      filtered = filtered.filter(f => f.get('lga_name') === filters.lga);
    }
    if (filters.ward) {
      filtered = filtered.filter(f => f.get('parentwardname') === filters.ward);
    }
    if (filters.period) {
      const periodFilter = filters.period;
      filtered = filtered.filter(f => {
        const featurePeriodRaw = f.get('period');
        if (!featurePeriodRaw) return false;
        const featurePeriod = String(featurePeriodRaw);
        if (!featurePeriod) return false;
        if (periodFilter.length === 4) {
          return featurePeriod.startsWith(periodFilter);
        }
        return featurePeriod === periodFilter;
      });
    }

    if (filters.minIncidence) {
      const minVal =
        valueMode === 'incidence'
          ? parseFloat(filters.minIncidence)
          : parseInt(filters.minIncidence, 10);
      if (!Number.isNaN(minVal)) {
        filtered = filtered.filter(f => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue >= minVal;
        });
      }
    }

    if (filters.maxIncidence) {
      const maxVal =
        valueMode === 'incidence'
          ? parseFloat(filters.maxIncidence)
          : parseInt(filters.maxIncidence, 10);
      if (!Number.isNaN(maxVal)) {
        filtered = filtered.filter(f => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue <= maxVal;
        });
      }
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

  const applyCompareFilters = (features: any[]) => {
    let filtered = features;

    const numericField = valueMode === 'incidence' ? 'incidence_per_1000' : 'case_count';

    if (filters.lga) {
      filtered = filtered.filter(f => f.get('lga_name') === filters.lga);
    }
    if (filters.ward) {
      filtered = filtered.filter(f => f.get('parentwardname') === filters.ward);
    }
    if (filters.period) {
      const periodFilter = filters.period;
      filtered = filtered.filter(f => {
        const featurePeriodRaw = f.get('period');
        if (!featurePeriodRaw) return false;
        const featurePeriod = String(featurePeriodRaw);
        if (!featurePeriod) return false;
        if (periodFilter.length === 4) {
          return featurePeriod.startsWith(periodFilter);
        }
        return featurePeriod === periodFilter;
      });
    }

    if (filters.minIncidence) {
      const minVal =
        valueMode === 'incidence'
          ? parseFloat(filters.minIncidence)
          : parseInt(filters.minIncidence, 10);
      if (!Number.isNaN(minVal)) {
        filtered = filtered.filter(f => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue >= minVal;
        });
      }
    }

    if (filters.maxIncidence) {
      const maxVal =
        valueMode === 'incidence'
          ? parseFloat(filters.maxIncidence)
          : parseInt(filters.maxIncidence, 10);
      if (!Number.isNaN(maxVal)) {
        filtered = filtered.filter(f => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue <= maxVal;
        });
      }
    }

    // In single-map mode, render comparison on the primary map's comparison layer.
    if (viewMode === 'single' && compareLayerRef.current) {
      const source = compareLayerRef.current.getSource();
      if (source) {
        source.clear();
        source.addFeatures(filtered);
      }
    }

    // In split view, render comparison on the secondary map's data layer.
    if (viewMode === 'split' && secondaryDataLayerRef.current) {
      const source = secondaryDataLayerRef.current.getSource();
      if (source) {
        source.clear();
        source.addFeatures(filtered);
      }
    }

    setSecondarySummary(filtered.length > 0 ? computeSummary(filtered) : null);
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

  const handleYearSelectChange = (year: string) => {
    setFilters(prev => {
      const prevPeriod = prev.period || '';
      const prevMonth = prevPeriod.length >= 6 ? prevPeriod.slice(4, 6) : '';
      let nextPeriod = '';
      if (!year) {
        nextPeriod = '';
      } else if (prevMonth) {
        nextPeriod = `${year}${prevMonth}`;
      } else {
        nextPeriod = year;
      }
      return { ...prev, period: nextPeriod };
    });
    setTimeChartMode('year');
    setChartSelectedYear(null);
  };

  const handleMonthSelectChange = (month: string) => {
    setFilters(prev => {
      const prevPeriod = prev.period || '';
      const year = prevPeriod.length >= 4 ? prevPeriod.slice(0, 4) : '';
      let nextPeriod = '';
      if (!month) {
        nextPeriod = year;
      } else if (year) {
        nextPeriod = `${year}${month}`;
      } else {
        nextPeriod = prev.period;
      }
      return { ...prev, period: nextPeriod };
    });
  };

  const resetFilters = () => {
    setFilters(prev => ({ ...prev, lga: '', ward: '', period: '', minIncidence: '', maxIncidence: '' }));
  };

  const filteredCount = dataLayerRef.current?.getSource()?.getFeatures().length || 0;

  const handleDownloadCsv = () => {
    try {
      const source = dataLayerRef.current?.getSource();
      if (!source) {
        alert('No data to export.');
        return;
      }
      const features = source.getFeatures();
      if (!features.length) {
        alert('No data to export for the current filters.');
        return;
      }

      const headers = [
        'metric_id',
        'metric_name',
        'facility_id',
        'facility_name',
        'lga_name',
        'ward_name',
        'period',
        'case_count',
        'incidence_per_1000',
        'population',
        'longitude',
        'latitude',
      ];

      const rows: string[] = [];
      rows.push(headers.join(','));

      const escapeCsv = (value: any) => {
        if (value === null || value === undefined) return '';
        const str = String(value).replace(/"/g, '""');
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str}"`;
        }
        return str;
      };

      for (const f of features) {
        const props = (name: string) => f.get(name);
        const values = [
          filters.metric,
          currentMetric.name,
          props('facility_id'),
          props('facility_name'),
          props('lga_name'),
          props('parentwardname'),
          props('period'),
          props('case_count'),
          props('incidence_per_1000'),
          props('population'),
          props('longitude'),
          props('latitude'),
        ].map(escapeCsv);
        rows.push(values.join(','));
      }

      const csvContent = rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const datePart = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.setAttribute('download', `${filters.metric || 'metric'}_${datePart}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV data.');
    }
  };

  // Filters block reused for desktop and mobile
  const FiltersBlock = (
    <>
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-2">Health Metrics Map</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Primary health metric</label>
          <select
            value={filters.metric}
            onChange={(e) => {
              const nextMetric = e.target.value;
              handleFilterChange('metric', nextMetric);
              setTimeChartMode('year');
              setChartSelectedYear(null);
              if (secondaryMetricId === nextMetric) {
                setSecondaryMetricId('');
                setCompareEnabled(false);
              }
            }}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            {metrics.map(metric => (
              <option key={metric.id} value={metric.id}>{metric.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">{currentMetric.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Compare with another metric</span>
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={compareEnabled}
            onChange={(e) => setCompareEnabled(e.target.checked)}
          />
        </div>

        {compareEnabled && (
          <div>
            <label className="block text-sm font-medium mb-1">Secondary health metric</label>
            <select
              value={secondaryMetricId}
              onChange={(e) => setSecondaryMetricId(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select metric</option>
              {metrics.map(metric => (
                <option
                  key={metric.id}
                  value={metric.id}
                  disabled={metric.id === filters.metric}
                >
                  {metric.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Secondary metric is shown as blue circles. Summary and time-series chart use the primary metric.
            </p>
            {compareLoading && (
              <p className="text-xs text-gray-500 mt-1">
                Loading secondary metric data...
              </p>
            )}
          </div>
        )}

        {compareEnabled && secondaryMetricId && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Spatial view</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex-1 px-2 py-1 rounded border text-xs ${
                  viewMode === 'single'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Single map
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex-1 px-2 py-1 rounded border text-xs ${
                  viewMode === 'split'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Side-by-side
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              Side-by-side shows the primary metric on the left and the secondary on the right.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Value Type</label>
          <select
            value={valueMode}
            onChange={(e) => {
              const nextMode = e.target.value as 'cases' | 'incidence';
              setValueMode(nextMode);
              setFilters(prev => ({
                ...prev,
                minIncidence: '',
                maxIncidence: ''
              }));
              setTimeChartMode('year');
              setChartSelectedYear(null);
            }}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="cases">Cases</option>
            <option value="incidence">Incidence per 1,000 (LGA population)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {valueMode === 'incidence' ? 'Incidence filter (per 1,000)' : 'Number of cases filter'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step={valueMode === 'incidence' ? '0.01' : '1'}
              min="0"
              value={filters.minIncidence}
              onChange={(e) => handleFilterChange('minIncidence', e.target.value)}
              placeholder={valueMode === 'incidence' ? 'Min incidence' : 'Min cases'}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step={valueMode === 'incidence' ? '0.01' : '1'}
              min="0"
              value={filters.maxIncidence}
              onChange={(e) => handleFilterChange('maxIncidence', e.target.value)}
              placeholder={valueMode === 'incidence' ? 'Max incidence' : 'Max cases'}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Loading data...</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => handleYearSelectChange(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All years</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Month</label>
              <select
                value={selectedYear ? selectedMonth : ''}
                onChange={(e) => handleMonthSelectChange(e.target.value)}
                disabled={!selectedYear}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">All months</option>
                {monthOptions.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
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

        {/* GRID3 Social Indicator Layers */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2 text-sm">GRID3 Indicator Layers</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={grid3Layers.population}
                  onChange={(e) => toggleGrid3Layer('population', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Population Density</span>
              </label>
              <div className="w-4 h-4 bg-blue-400/50 border border-blue-600 rounded"></div>
            </div>
            <p className="text-xs text-gray-500 ml-6">LGA-level population from GRID3</p>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={grid3Layers.settlements}
                  onChange={(e) => toggleGrid3Layer('settlements', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Settlement Types</span>
              </label>
              <div className="w-4 h-4 bg-orange-400/60 border border-orange-600 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 ml-6">Urban/rural classification</p>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={grid3Layers.facility_access}
                  onChange={(e) => toggleGrid3Layer('facility_access', e.target.checked)}
                  className="h-4 w-4"
                />
                <span>Facility Access</span>
              </label>
              <div className="flex gap-1">
                <div className="w-3 h-4 bg-green-500/50 border border-gray-600"></div>
                <div className="w-3 h-4 bg-red-500/50 border border-gray-600"></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 ml-6">Travel time to nearest facility</p>
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Reset Filters
        </button>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Download filtered data (CSV)
        </button>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>Case location (size = selected value type)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-blue-700 bg-blue-500/60"></div>
              <span>Secondary metric (comparison)</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const getBaseFeaturesForChart = (inputFeatures: any[]) => {
    let features = inputFeatures as any[];

    if (filters.lga) {
      features = features.filter((f: any) => f.get('lga_name') === filters.lga);
    }
    if (filters.ward) {
      features = features.filter((f: any) => f.get('parentwardname') === filters.ward);
    }

    const numericField = valueMode === 'incidence' ? 'incidence_per_1000' : 'case_count';

    if (filters.minIncidence) {
      const minVal =
        valueMode === 'incidence'
          ? parseFloat(filters.minIncidence)
          : parseInt(filters.minIncidence, 10);
      if (!Number.isNaN(minVal)) {
        features = features.filter((f: any) => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue >= minVal;
        });
      }
    }

    if (filters.maxIncidence) {
      const maxVal =
        valueMode === 'incidence'
          ? parseFloat(filters.maxIncidence)
          : parseInt(filters.maxIncidence, 10);
      if (!Number.isNaN(maxVal)) {
        features = features.filter((f: any) => {
          const raw = f.get(numericField);
          const numericValue = raw !== undefined && raw !== null ? Number(raw) : NaN;
          return !Number.isNaN(numericValue) && numericValue <= maxVal;
        });
      }
    }

    return features;
  };

  const buildYearSeries = () => {
    const primaryBase = getBaseFeaturesForChart(allFeaturesRef.current);
    const secondaryBase =
      compareEnabled && secondaryMetricId
        ? getBaseFeaturesForChart(compareFeaturesRef.current)
        : [];

    const primaryTotals = new Map<number, number>();
    const secondaryTotals = new Map<number, number>();
    const yearSet = new Set<number>();

    const accumulate = (features: any[], target: Map<number, number>) => {
      for (const f of features) {
        const periodRaw = f.get('period');
        if (!periodRaw) continue;
        const periodStr = String(periodRaw);
        if (periodStr.length < 4) continue;
        const year = Number(periodStr.slice(0, 4));
        if (Number.isNaN(year)) continue;
        const cases = Number(f.get('case_count') || 0);
        yearSet.add(year);
        target.set(year, (target.get(year) || 0) + cases);
      }
    };

    accumulate(primaryBase, primaryTotals);
    accumulate(secondaryBase, secondaryTotals);

    const years = Array.from(yearSet).sort((a, b) => a - b);

    return years.map(year => ({
      key: String(year),
      label: String(year),
      year,
      primaryCases: primaryTotals.get(year) || 0,
      secondaryCases: secondaryTotals.get(year) || 0,
    }));
  };

  const buildMonthSeries = (year: number) => {
    const primaryBase = getBaseFeaturesForChart(allFeaturesRef.current);
    const secondaryBase =
      compareEnabled && secondaryMetricId
        ? getBaseFeaturesForChart(compareFeaturesRef.current)
        : [];

    const primaryMonthMap = new Map<number, number>();
    const secondaryMonthMap = new Map<number, number>();
    const monthsSet = new Set<number>();
    const yearStr = String(year);

    const accumulate = (features: any[], target: Map<number, number>) => {
      for (const f of features) {
        const periodRaw = f.get('period');
        if (!periodRaw) continue;
        const periodStr = String(periodRaw);
        if (!periodStr.startsWith(yearStr) || periodStr.length < 6) continue;
        const month = Number(periodStr.slice(4, 6));
        if (Number.isNaN(month) || month < 1 || month > 12) continue;
        const cases = Number(f.get('case_count') || 0);
        monthsSet.add(month);
        target.set(month, (target.get(month) || 0) + cases);
      }
    };

    accumulate(primaryBase, primaryMonthMap);
    accumulate(secondaryBase, secondaryMonthMap);

    const months = Array.from(monthsSet).sort((a, b) => a - b);

    return months.map((month) => ({
      key: `${year}-${month}`,
      label: MONTH_LABELS[month - 1] ?? String(month),
      year,
      month,
      primaryCases: primaryMonthMap.get(month) || 0,
      secondaryCases: secondaryMonthMap.get(month) || 0,
    }));
  };

  const yearSeries = buildYearSeries();
  const monthSeries =
    timeChartMode === 'month' && chartSelectedYear != null
      ? buildMonthSeries(chartSelectedYear)
      : [];

  return (
    <div className="relative h-full">
      {/* Population summary bar */}
      <div className="absolute top-3 right-4 z-10 bg-white/95 rounded-lg shadow px-4 py-2 text-xs md:text-sm">
        <div className="font-semibold">
          {selectedLga && selectedLgaPopulation != null
            ? `${selectedLga} population`
            : 'Anambra population'}
        </div>
        <div>
          {formatPopulation(selectedLgaPopulation ?? statePopulation)}
        </div>
      </div>
      {/* Filter toggle button - visible on all screen sizes */}
      <button
        type="button"
        className="absolute top-3 left-12 z-20 px-3 py-2 bg-white rounded-lg shadow-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        onClick={() => setMobileFiltersOpen(v => !v)}
      >
        {mobileFiltersOpen ? '✕ Close Filters' : '☰ Open Filters'}
      </button>

      {/* Filter panel - shows as overlay when toggle is active */}
      {mobileFiltersOpen && (
        <div className="absolute z-20 bg-white border rounded-lg shadow-lg overflow-y-auto inset-x-4 top-14 max-h-[80vh] md:top-4 md:left-4 md:inset-x-auto md:w-80 md:max-h-[85vh] md:mt-12">
          {FiltersBlock}
        </div>
      )}

      {/* Full-map loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-700 font-medium">
              Loading {currentMetric.name} data...
            </p>
          </div>
        </div>
      )}

      {/* Time-series chart overlay */}
      {yearSeries.length > 0 && chartOpen && (
        <div className="absolute left-4 bottom-4 z-10 bg-white/95 border rounded-lg shadow-lg p-3 w-96 md:w-[420px] max-w-[90vw] text-xs md:text-sm">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold">
                {timeChartMode === 'year'
                  ? `Yearly cases of ${currentMetric.name}`
                  : `Monthly cases of ${currentMetric.name}`}
              </h3>
              <p className="text-[11px] text-gray-500">
                {timeChartMode === 'year'
                  ? 'Click a year to view monthly breakdown.'
                  : chartSelectedYear
                    ? `Click a month to focus the map on ${chartSelectedYear}.`
                    : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {timeChartMode === 'month' && (
                <button
                  type="button"
                  className="text-[11px] px-2 py-1 border rounded hover:bg-gray-50"
                  onClick={() => {
                    setTimeChartMode('year');
                    setChartSelectedYear(null);
                    setFilters(prev => ({ ...prev, period: '' }));
                  }}
                >
                  Back to years
                </button>
              )}
              <button
                type="button"
                className="text-[11px] px-2 py-1 border rounded hover:bg-gray-50"
                onClick={() => setChartOpen(false)}
              >
                Hide
              </button>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeChartMode === 'year' ? yearSeries : monthSeries}
                onClick={(state: any) => {
                  if (!state || !state.activeLabel) return;
                  if (timeChartMode === 'year') {
                    const year = Number(state.activeLabel);
                    if (!Number.isNaN(year)) {
                      setTimeChartMode('month');
                      setChartSelectedYear(year);
                      setFilters(prev => ({ ...prev, period: String(year) }));
                    }
                  } else if (timeChartMode === 'month' && chartSelectedYear != null) {
                    const label = String(state.activeLabel);
                    const monthIndex = MONTH_LABELS.indexOf(label);
                    if (monthIndex >= 0) {
                      const monthStr = String(monthIndex + 1).padStart(2, '0');
                      const period = `${chartSelectedYear}${monthStr}`;
                      setFilters(prev => ({ ...prev, period }));
                    }
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="primaryCases"
                  stroke="#f97316"
                  name={currentMetric.name}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                {compareEnabled && secondaryMetricId && (
                  <Line
                    type="monotone"
                    dataKey="secondaryCases"
                    stroke="#1d4ed8"
                    name={secondaryMetric?.name || 'Secondary metric'}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Burden summary overlay */}
      {summary && summaryOpen && (
        <div className="absolute right-4 bottom-4 z-10 bg-white/95 border rounded-lg shadow-lg p-4 w-80 max-w-[90vw] text-sm space-y-3">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold">Burden summary</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Current filters</span>
              <button
                type="button"
                className="text-[11px] px-2 py-1 border rounded hover:bg-gray-50"
                onClick={() => setSummaryOpen(false)}
              >
                Hide
              </button>
            </div>
          </div>
          {secondarySummary && (
            <div className="border rounded-md p-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="font-medium truncate">
                  Primary: {currentMetric.name}
                </span>
                <span>{summary.totalCases.toLocaleString()} cases</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium truncate">
                  Secondary: {secondaryMetric?.name || 'Secondary metric'}
                </span>
                <span>{secondarySummary.totalCases.toLocaleString()} cases</span>
              </div>
              {secondarySummary.totalCases > 0 && (
                <div className="flex justify-between text-[11px] text-gray-600">
                  <span>Primary / Secondary cases</span>
                  <span>
                    {(summary.totalCases / secondarySummary.totalCases).toFixed(2)} ×
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
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

      {!chartOpen && yearSeries.length > 0 && (
        <button
          type="button"
          className="absolute left-4 bottom-4 z-10 px-3 py-1.5 bg-white/90 border rounded-full text-xs shadow"
          onClick={() => setChartOpen(true)}
        >
          Show chart
        </button>
      )}

      {!summaryOpen && summary && (
        <button
          type="button"
          className="absolute right-4 bottom-4 z-10 px-3 py-1.5 bg-white/90 border rounded-full text-xs shadow"
          onClick={() => setSummaryOpen(true)}
        >
          Show summary
        </button>
      )}

      {/* Map Container */}
      <div className="w-full h-full">
        {viewMode === 'split' && compareEnabled && secondaryMetricId ? (
          <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative">
              <div ref={mapRef} className="w-full h-full" />
              <div className="absolute top-16 left-2 bg-white/80 px-2 py-1 text-[11px] font-medium rounded shadow-sm">
                Primary: {currentMetric.name}
              </div>
            </div>
            <div className="relative">
              <div ref={secondaryMapRef} className="w-full h-full" />
              <div className="absolute top-16 left-2 bg-white/80 px-2 py-1 text-[11px] font-medium rounded shadow-sm">
                Secondary: {secondaryMetric?.name || 'Secondary metric'}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <div ref={mapRef} className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default QGISFilterableMap;
