import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LgaValueMap, LGAS } from '@/utils/lgaData';

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Anambra State center coordinates
const ANAMBRA_CENTER: [number, number] = [6.2104, 7.0722];
const DEFAULT_ZOOM = 9;

interface AnambraLGAMapProps {
  values?: LgaValueMap;
  className?: string;
}

const AnambraLGAMap: React.FC<AnambraLGAMapProps> = ({ values, className = '' }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  // Load GeoJSON data
  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch('/data/anambra-lgas-simplified.geojson');
        const data = await response.json();
        setGeoJsonData(data);
        
        // Set default bounds for Anambra State
        const southWest = L.latLng(5.8, 6.7);
        const northEast = L.latLng(6.5, 7.4);
        const bounds = L.latLngBounds(southWest, northEast);
        setBounds(bounds);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
        // Fallback to default bounds if GeoJSON fails to load
        const southWest = L.latLng(5.8, 6.7);
        const northEast = L.latLng(6.5, 7.4);
        setBounds(L.latLngBounds(southWest, northEast));
      }
    };

    loadGeoJson();
  }, []);

  // Initialize map when component mounts and GeoJSON is loaded
  useEffect(() => {
    if (!mapContainerRef.current || !bounds || !isMounted) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: ANAMBRA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      zoomSnap: 0.1,
      maxBounds: [
        [5.5, 6.5], // Southwest coordinates
        [6.8, 7.6]  // Northeast coordinates
      ],
      maxBoundsViscosity: 1.0 // Strict bounds
    });

    // Add OSM tile layer with proper attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 8
    }).addTo(map);

    // Fit map to bounds with padding if bounds are available
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [bounds, isMounted]);

  // Add GeoJSON layer when map and data are ready
  useEffect(() => {
    if (!mapRef.current || !geoJsonData || !values) return;

    // Style function for the GeoJSON layer
    const style = (feature: any) => {
      const lgaName = feature.properties.name;
      const value = values[lgaName] || 0;
      
      return {
        fillColor: getColor(value),
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.7,
      };
    };

    // Highlight feature on hover
    const highlightFeature = (e: any) => {
      const layer = e.target;
      layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.9,
      });

      layer.bringToFront();
    };

    // Reset highlight on mouseout
    const resetHighlight = (e: any) => {
      const layer = e.target;
      layer.setStyle({
        weight: 1,
        color: '#ffffff',
        fillOpacity: 0.7,
      });
    };

    // Add GeoJSON layer
    const geojsonLayer = L.geoJSON(geoJsonData, {
      style,
      onEachFeature: (feature, layer) => {
        const lgaName = feature.properties.name;
        const value = values[lgaName] || 0;
        
        // Add tooltip
        layer.bindTooltip(`<b>${lgaName}</b><br>Value: ${value}`, {
          direction: 'top',
          className: 'lga-tooltip',
        });

        // Add hover effects
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
        });

        // Add accessibility
        if (layer.setStyle) {
          layer.setStyle({
            // @ts-ignore
            'aria-label': `${lgaName}: ${value}`,
          });
        }
      },
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.removeLayer(geojsonLayer);
      }
    };
  }, [geoJsonData, values]);

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get color for LGA based on value
  const getColor = (value: number): string => {
    if (value < 20) return '#e6f0ff';  // Very light blue
    if (value < 40) return '#b3d1ff';  // Light blue
    if (value < 60) return '#80b3ff';  // Medium blue
    if (value < 80) return '#4d94ff';  // Blue
    return '#1a75ff';                  // Dark blue
  };

  // Generate legend
  const Legend = () => (
    <div className="absolute right-3 bottom-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md z-[1000] text-xs">
      <div className="font-semibold mb-2">Data Coverage (%)</div>
      <div className="space-y-1">
        {[
          { range: '81-100%', color: getColor(90) },
          { range: '61-80%', color: getColor(70) },
          { range: '41-60%', color: getColor(50) },
          { range: '21-40%', color: getColor(30) },
          { range: '0-20%', color: getColor(10) },
        ].map((item) => (
          <div key={item.range} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-sm mr-2 border border-gray-300"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span>{item.range}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-500 italic">
        Hover over LGAs for details
      </div>
    </div>
  );

  return (
    <div className={`relative w-full h-[400px] sm:h-[500px] md:h-[600px] ${className}`}>
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg border-2 border-gray-300 shadow-md"
        aria-label="Interactive map of Anambra State showing LGA data"
      />
      <Legend />
      <div className="absolute bottom-3 left-3 bg-white/80 px-2 py-1 rounded text-xs text-gray-600 z-[1000]">
        <span className="font-medium">Anambra State</span> • {new Date().toLocaleDateString()}
      </div>
      {!geoJsonData && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[999]">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnambraLGAMap;
