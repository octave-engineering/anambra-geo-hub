import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Anambra State coordinates - tighter bounds to focus only on Anambra
const ANAMBRA_BOUNDS = L.latLngBounds(
  L.latLng(5.9, 6.8),  // Southwest coordinates
  L.latLng(6.4, 7.3)   // Northeast coordinates
);

// Sample data for the 21 LGAs in Anambra State with varying data availability
const lgaData = [
  { name: "Aguata", lat: 6.1167, lng: 7.0833, datasets: 18, availability: 92 },
  { name: "Anambra East", lat: 6.3333, lng: 6.9167, datasets: 14, availability: 78 },
  { name: "Anambra West", lat: 6.3333, lng: 6.7833, datasets: 9, availability: 65 },
  { name: "Anaocha", lat: 6.2000, lng: 7.0000, datasets: 16, availability: 85 },
  { name: "Awka North", lat: 6.2500, lng: 7.0833, datasets: 12, availability: 72 },
  { name: "Awka South", lat: 6.2000, lng: 7.0833, datasets: 22, availability: 95 },
  { name: "Ayamelum", lat: 6.4000, lng: 6.9167, datasets: 7, availability: 58 },
  { name: "Dunukofia", lat: 6.1667, lng: 7.0000, datasets: 15, availability: 82 },
  { name: "Ekwusigo", lat: 6.0000, lng: 6.9167, datasets: 11, availability: 68 },
  { name: "Idemili North", lat: 6.1333, lng: 6.9167, datasets: 19, availability: 88 },
  { name: "Idemili South", lat: 6.0833, lng: 6.8333, datasets: 13, availability: 75 },
  { name: "Ihiala", lat: 5.8500, lng: 6.8667, datasets: 10, availability: 62 },
  { name: "Njikoka", lat: 6.1667, lng: 7.0000, datasets: 14, availability: 79 },
  { name: "Nnewi North", lat: 6.0167, lng: 6.9167, datasets: 20, availability: 91 },
  { name: "Nnewi South", lat: 5.9667, lng: 6.9167, datasets: 17, availability: 84 },
  { name: "Ogbaru", lat: 6.0833, lng: 6.7500, datasets: 8, availability: 55 },
  { name: "Onitsha North", lat: 6.1667, lng: 6.7833, datasets: 24, availability: 97 },
  { name: "Onitsha South", lat: 6.1333, lng: 6.8000, datasets: 21, availability: 93 },
  { name: "Orumba North", lat: 6.1667, lng: 7.1667, datasets: 11, availability: 69 },
  { name: "Orumba South", lat: 6.0833, lng: 7.0000, datasets: 9, availability: 60 },
  { name: "Oyi", lat: 6.2500, lng: 6.8333, datasets: 13, availability: 74 },
];

// Create polygon coordinates for each LGA (simplified for demo)
const createPolygon = (lat: number, lng: number, size = 0.03): [number, number][][] => {
  return [
    [
      [lat - size, lng - size],
      [lat + size, lng - size],
      [lat + size, lng + size],
      [lat - size, lng + size],
      [lat - size, lng - size],
    ],
  ];
};

// Generate GeoJSON data
const generateGeoJSON = () => {
  return {
    type: 'FeatureCollection',
    features: lgaData.map(lga => ({
      type: 'Feature',
      properties: {
        name: lga.name,
        datasets: lga.datasets,
        portal: 'Anambra GeoHub',
        category: 'Health Data'
      },
      geometry: {
        type: 'Polygon',
        coordinates: createPolygon(lga.lat, lga.lng)
      }
    }))
  };
};

// Sample dataset categories and counts for each LGA
const generateDatasetInfo = (lgaName: string) => {
  const categories = [
    'Health Facilities', 'Population Data', 'Education', 'Infrastructure', 
    'Agriculture', 'Water Resources', 'Transportation', 'Economic Data'
  ];
  
  // Generate random datasets for the LGA
  const datasets = [];
  const numDatasets = Math.floor(Math.random() * 15) + 15; // 15-30 datasets
  
  for (let i = 0; i < numDatasets; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const year = 2020 + Math.floor(Math.random() * 4); // 2020-2023
    const size = (Math.random() * 5 + 1).toFixed(1); // 1.0 - 6.0 MB
    
    datasets.push({
      id: `dataset-${lgaName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      name: `${lgaName} ${category} ${year}`,
      category,
      year,
      size: `${size} MB`,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString()
    });
  }
  
  // Group by category
  const byCategory = datasets.reduce((acc, dataset) => {
    if (!acc[dataset.category]) {
      acc[dataset.category] = [];
    }
    acc[dataset.category].push(dataset);
    return acc;
  }, {} as Record<string, any[]>);
  
  return { total: datasets.length, byCategory };
};

const InteractiveAnambraMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<{total: number; byCategory: Record<string, any[]>} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const geoJsonData = generateGeoJSON();

  // Initialize static map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map with static options
    const map = L.map(mapContainerRef.current, {
      center: ANAMBRA_BOUNDS.getCenter(),
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      dragging: false,
      tap: false,
      zoomSnap: 0.1
    });

    // Add OSM tile layer with static attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 12,
      minZoom: 8
    }).addTo(map);

    // Fit map to Anambra bounds
    map.fitBounds(ANAMBRA_BOUNDS);

    // Add GeoJSON layer with data-driven styling
    L.geoJSON(geoJsonData as any, {
      style: (feature: any) => {
        const availability = feature?.properties?.availability || 0;
        // Color based on data availability percentage using Anambra's brand color (#ffaa00)
        let fillColor = '#ffaa00'; // Base Anambra color
        let opacity = 0.3; // Default opacity for low availability
        
        if (availability >= 90) opacity = 1.0;
        else if (availability >= 80) opacity = 0.8;
        else if (availability >= 70) opacity = 0.6;
        else if (availability >= 60) opacity = 0.4;
        
        return {
          fillColor,
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: opacity,
          dashArray: availability < 50 ? '5, 5' : undefined // Add dashed border for low availability
        };
      },
      onEachFeature: (feature, layer) => {
        if (!feature.properties) return;
        const { name, datasets, availability } = feature.properties;
        
        // Click handler for LGA
        layer.on('click', () => {
          setIsLoading(true);
          setSelectedLGA(name);
          
          // Simulate API call to fetch dataset info
          setTimeout(() => {
            setDatasetInfo(generateDatasetInfo(name));
            setIsLoading(false);
          }, 500);
        });
        
        // Hover effect
        layer.on('mouseover', () => {
          layer.setStyle({
            weight: 3,
            color: '#1e40af',
            fillOpacity: 0.9
          });
          
          // Show tooltip on hover
          layer.bindTooltip(
            `<div class="custom-tooltip-container bg-white p-2 rounded shadow-md">
              <div class="font-bold text-[#1a365d]">${name}</div>
              <div class="text-sm">Click to view ${datasets} datasets</div>
            </div>`,
            { 
              direction: 'right',
              className: 'custom-tooltip',
              offset: [10, 0]
            }
          ).openTooltip();
        });

        layer.on('mouseout', () => {
          layer.setStyle({
            weight: 1,
            color: 'white',
            fillOpacity: 0.8
          });
          layer.closeTooltip();
        });
      }
    }).addTo(map);

      // Add title using a simple div overlay
    const title = L.control({position: 'topright'});
    title.onAdd = function() {
      const div = L.DomUtil.create('div', 'map-title');
      div.innerHTML = '<strong>Anambra State LGAs</strong>';
      return div;
    };
    title.addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Close dataset panel
  const closeDatasetPanel = () => {
    setSelectedLGA(null);
    setDatasetInfo(null);
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainerRef} 
        className="w-full h-[500px] sm:h-[600px] rounded-lg border border-gray-200 shadow-sm"
      />
      
      {/* Dataset Panel */}
      {selectedLGA && (
        <div className="absolute top-4 right-4 bottom-4 w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col z-[1000] overflow-hidden">
          <div className="bg-[#ffaa00] text-white p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedLGA} LGA</h2>
              <button 
                onClick={closeDatasetPanel}
                className="text-white hover:bg-white/20 p-1 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="text-sm opacity-90">
              {datasetInfo ? `${datasetInfo.total} datasets available` : 'Loading...'}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffaa00]"></div>
              </div>
            ) : datasetInfo ? (
              <div className="space-y-4">
                {Object.entries(datasetInfo.byCategory).map(([category, datasets]) => (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h3 className="font-semibold text-gray-700">{category}</h3>
                      <div className="text-xs text-gray-500">{datasets.length} datasets</div>
                    </div>
                    <div className="divide-y">
                      {datasets.map((dataset, i) => (
                        <div key={i} className="p-3 hover:bg-gray-50 cursor-pointer">
                          <div className="font-medium text-sm">{dataset.name}</div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Updated: {dataset.lastUpdated}</span>
                            <span>{dataset.size}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          
          <div className="border-t p-3 bg-gray-50">
            <button 
              className="w-full bg-[#ffaa00] hover:bg-[#e69500] text-white py-2 px-4 rounded-md font-medium transition-colors"
              onClick={() => {
                // Action to download all datasets
                alert(`Downloading all ${datasetInfo?.total} datasets for ${selectedLGA}`);
              }}
            >
              Download All Datasets
            </button>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000] text-sm border border-gray-100">
        <div className="font-bold text-[#1a365d] mb-3 text-center">Data Availability Legend</div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-[#ffaa00] rounded-sm opacity-100"></div>
            <span>90-100% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-[#ffaa00] rounded-sm opacity-80"></div>
            <span>80-89% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-[#ffaa00] rounded-sm opacity-60"></div>
            <span>70-79% Complete</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 bg-[#ffaa00] rounded-sm opacity-40"></div>
            <span>Below 70%</span>
          </div>
          <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
            <div className="w-5 h-5 mr-2 border border-dashed border-gray-400 rounded-sm"></div>
            <span className="text-xs">Data needs update</span>
          </div>
        </div>
      </div>
      <style>{`
        .interactive-map .custom-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          pointer-events: none;
        }
        
        .interactive-map .custom-tooltip-container {
          min-width: 200px;
          pointer-events: none;
        }
        
        /* Scrollbar styles for dataset panel */
        .interactive-map ::-webkit-scrollbar {
          width: 6px;
        }
        
        .interactive-map ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .interactive-map ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .interactive-map ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Animation for dataset panel */
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .interactive-map .dataset-panel-enter {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default InteractiveAnambraMap;
