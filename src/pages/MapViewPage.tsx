

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Info, Layers, Filter, Search, X, MapPin, ZoomIn, ZoomOut, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { healthDatasets } from "@/data/datasets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from 'next/dynamic';

// Define types for LGA data
interface LGAData {
  name: string;
  coord: [number, number];
  datasets: number;
  category: string;
}

// LGA centers for Anambra State with sample data
const lgaCenters: LGAData[] = [
  { name: "Aguata", coord: [6.02, 7.08], datasets: 12, category: 'disease' },
  { name: "Anambra East", coord: [6.20, 6.92], datasets: 8, category: 'facility' },
  { name: "Anambra West", coord: [6.30, 6.80], datasets: 6, category: 'population' },
  { name: "Anaocha", coord: [6.10, 7.00], datasets: 10, category: 'disease' },
  { name: "Awka North", coord: [6.25, 7.10], datasets: 7, category: 'facility' },
  { name: "Awka South", coord: [6.20, 7.05], datasets: 15, category: 'population' },
  { name: "Ayamelum", coord: [6.40, 6.90], datasets: 5, category: 'disease' },
  { name: "Dunukofia", coord: [6.15, 7.00], datasets: 8, category: 'facility' },
  { name: "Ekwusigo", coord: [6.00, 6.95], datasets: 7, category: 'population' },
  { name: "Idemili North", coord: [6.10, 6.90], datasets: 9, category: 'disease' },
  { name: "Idemili South", coord: [6.05, 6.85], datasets: 6, category: 'facility' },
  { name: "Ihiala", coord: [5.85, 6.90], datasets: 8, category: 'population' },
  { name: "Njikoka", coord: [6.10, 7.00], datasets: 7, category: 'disease' },
  { name: "Nnewi North", coord: [6.00, 6.90], datasets: 10, category: 'facility' },
  { name: "Nnewi South", coord: [5.95, 6.85], datasets: 6, category: 'population' },
  { name: "Ogbaru", coord: [5.90, 6.80], datasets: 5, category: 'disease' },
  { name: "Onitsha North", coord: [6.15, 6.80], datasets: 12, category: 'facility' },
  { name: "Onitsha South", coord: [6.10, 6.75], datasets: 9, category: 'population' },
  { name: "Orumba North", coord: [6.05, 7.10], datasets: 7, category: 'disease' },
  { name: "Orumba South", coord: [6.00, 7.05], datasets: 6, category: 'facility' },
  { name: "Oyi", coord: [6.15, 6.90], datasets: 8, category: 'population' },
];

// Create a simple square polygon for each LGA
const createSquarePolygon = (center: [number, number], size = 0.06): [number, number][][] => {
  const [lat, lng] = center;
  return [
    [
      [lng - size, lat - size],
      [lng + size, lat - size],
      [lng + size, lat + size],
      [lng - size, lat + size],
      [lng - size, lat - size],
    ],
  ];
};

// Create GeoJSON features for LGAs
const createGeoJSONFeatures = (lgas: LGAData[]) => {
  return {
    type: 'FeatureCollection',
    features: lgas.map((lga) => ({
      type: 'Feature',
      properties: {
        name: lga.name,
        datasets: lga.datasets,
        category: lga.category,
      },
      geometry: {
        type: 'Polygon',
        coordinates: createSquarePolygon([lga.coord[0], lga.coord[1]]),
      },
    })),
  };
};

// Get color based on number of datasets
const getColorByDatasets = (count: number) => {
  if (count >= 10) return '#1d4ed8'; // blue-700
  if (count >= 7) return '#3b82f6';  // blue-500
  if (count >= 5) return '#60a5fa';  // blue-400
  return '#93c5fd';                  // blue-300
};

// Get color based on category
const getColorByCategory = (category: string) => {
  const colors: Record<string, string> = {
    disease: '#ef4444',  // red-500
    facility: '#10b981', // emerald-500
    population: '#8b5cf6', // violet-500
  };
  return colors[category] || '#94a3b8'; // slate-400
};

// MapViewPage Component
const MapViewPage = () => {
  const [selectedLGA, setSelectedLGA] = useState<LGAData | null>(null);
  const [hoveredLGA, setHoveredLGA] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'datasets' | 'categories'>('datasets');
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts (to handle SSR)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const GeoJSON = dynamic(
    () => import('react-leaflet').then((mod) => mod.GeoJSON),
    { ssr: false }
  );

const useMapEventsHandler = (onClick: (e: any) => void) => {
  const map = useMap();
  
  useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  
  return null;
};

// Define types
interface LGAData {
  name: string;
  coord: [number, number];
  datasets: number;
}

const MapViewPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024");
  const [selectedDatasetType, setSelectedDatasetType] = useState<string>("all");
  const [selectedLGA, setSelectedLGA] = useState<string | null>(null);
  const [hoveredLGA, setHoveredLGA] = useState<string | null>(null);
  const [drawMode, setDrawMode] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  // Mock disease trend data
  const diseaseData = [
    { month: "Jan", malaria: 450, hiv: 89, tb: 34, ntd: 23 },
    { month: "Feb", malaria: 520, hiv: 92, tb: 28, ntd: 31 },
    { month: "Mar", malaria: 480, hiv: 88, tb: 41, ntd: 19 },
    { month: "Apr", malaria: 390, hiv: 95, tb: 37, ntd: 27 },
    { month: "May", malaria: 340, hiv: 91, tb: 33, ntd: 22 },
    { month: "Jun", malaria: 410, hiv: 87, tb: 39, ntd: 29 },
    { month: "Jul", malaria: 580, hiv: 94, tb: 45, ntd: 35 },
    { month: "Aug", malaria: 620, hiv: 96, tb: 42, ntd: 38 },
    { month: "Sep", malaria: 550, hiv: 89, tb: 36, ntd: 26 },
    { month: "Oct", malaria: 490, hiv: 93, tb: 40, ntd: 31 },
    { month: "Nov", malaria: 430, hiv: 90, tb: 35, ntd: 24 },
    { month: "Dec", malaria: 380, hiv: 88, tb: 32, ntd: 20 },
  ];

  // Mock LGA data
  const lgaData = [
    { name: "Aguata", cases: 400 },
    { name: "Anaocha", cases: 570 },
    { name: "Anambra East", cases: 190 },
    { name: "Anambra West", cases: 595 },
    { name: "Awka North", cases: 450 },
    { name: "Awka South", cases: 380 },
    { name: "Ayamelum", cases: 60 },
    { name: "Dunukofia", cases: 165 },
    { name: "Ekwusigo", cases: 655 },
    { name: "Idemili North", cases: 100 },
    { name: "Idemili South", cases: 110 },
    { name: "Ihiala", cases: 420 },
    { name: "Njikoka", cases: 75 },
    { name: "Nnewi North", cases: 340 },
    { name: "Nnewi South", cases: 280 },
    { name: "Ogbaru", cases: 95 },
    { name: "Onitsha North", cases: 620 },
    { name: "Onitsha South", cases: 510 },
    { name: "Orumba North", cases: 85 },
    { name: "Orumba South", cases: 190 },
    { name: "Oyi", cases: 70 },
  ];

  // Mock facility distribution data
  const facilityData = [
    { name: "Primary Health Centers", value: 248 },
    { name: "Secondary Hospitals", value: 45 },
    { name: "Tertiary Hospitals", value: 8 },
    { name: "Private Clinics", value: 156 },
  ];

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6"];

  const keyMetrics = [
    {
      title: "Total Cases This Month",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase",
      icon: Activity,
      color: "text-red-600",
    },
    {
      title: "Health Facilities",
      value: "457",
      change: "+3",
      changeType: "increase",
      icon: MapIcon,
      color: "text-blue-600",
    },
    {
      title: "Data Coverage",
      value: "98.7%",
      change: "+1.2%",
      changeType: "increase",
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Response Rate",
      value: "94.3%",
      change: "-0.8%",
      changeType: "decrease",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  /***************
   * Demo Anambra GeoJSON
   ***************/
  const lgaCenters = [
    { name: "Aguata", coord: [7.09, 6.03], datasets: getDatasetsByCategory('disease').length + getDatasetsByCategory('facility').length },
    { name: "Anaocha", coord: [6.95, 6.17], datasets: getDatasetsByPortal('DHIS2').length },
    { name: "Anambra East", coord: [7.66, 6.18], datasets: getDatasetsByCategory('population').length },
    { name: "Anambra West", coord: [6.40, 6.56], datasets: getDatasetsByPortal('GRID3').length },
    { name: "Awka North", coord: [7.01, 6.36], datasets: getDatasetsByCategory('facility').length },
    { name: "Awka South", coord: [7.07, 6.21], datasets: getDatasetsByPortal('DHIS2').length },
    { name: "Ayamelum", coord: [6.50, 6.40], datasets: getDatasetsByCategory('population').length },
    { name: "Dunukofia", coord: [6.90, 6.25], datasets: getDatasetsByCategory('disease').length },
    { name: "Ekwusigo", coord: [6.96, 6.08], datasets: getDatasetsByPortal('DHIS2').length },
    { name: "Idemili North", coord: [6.83, 6.22], datasets: getDatasetsByCategory('facility').length },
    { name: "Idemili South", coord: [6.80, 6.15], datasets: getDatasetsByCategory('disease').length },
    { name: "Ihiala", coord: [6.09, 5.98], datasets: getDatasetsByPortal('DHIS2').length },
    { name: "Njikoka", coord: [7.03, 6.18], datasets: getDatasetsByCategory('population').length },
    { name: "Nnewi North", coord: [6.03, 6.01], datasets: getDatasetsByCategory('facility').length },
    { name: "Nnewi South", coord: [6.02, 5.90], datasets: getDatasetsByCategory('disease').length },
    { name: "Ogbaru", coord: [6.75, 5.95], datasets: getDatasetsByPortal('GRID3').length },
    { name: "Onitsha North", coord: [6.78, 6.16], datasets: getDatasetsByCategory('facility').length },
    { name: "Onitsha South", coord: [6.80, 6.14], datasets: getDatasetsByCategory('disease').length },
    { name: "Orumba North", coord: [7.18, 6.02], datasets: getDatasetsByCategory('population').length },
    { name: "Orumba South", coord: [7.22, 5.95], datasets: getDatasetsByCategory('facility').length },
    { name: "Oyi", coord: [7.13, 6.33], datasets: getDatasetsByCategory('population').length },
  ];

  const makeSquarePolygon = (lng: number, lat: number, size = 0.035): number[][][] => [
    [
      [lng - size, lat - size],
      [lng + size, lat - size],
      [lng + size, lat + size],
      [lng - size, lat + size],
      [lng - size, lat - size],
    ],
  ];

  const anambraGeoJSON: FeatureCollection<Polygon, any> = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: lgaCenters.map((lga) => ({
        type: "Feature",
        properties: {
          name: lga.name,
          datasets: lga.datasets,
          portal: selectedDatasetType === 'all' ? 'mixed' : selectedDatasetType,
          category: 'mixed'
        },
        geometry: {
          type: "Polygon",
          coordinates: makeSquarePolygon(lga.coord[0], lga.coord[1], 0.03)
        },
      })),
    };
  }, [selectedDatasetType]);

  const nigeriaGeoJSON: FeatureCollection<Polygon, { name: string }> = useMemo(() => ({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "NigeriaBBox" },
        geometry: {
          type: "Polygon",
          coordinates: [[[2.6, 4.2], [14.8, 4.2], [14.8, 13.9], [2.6, 13.9], [2.6, 4.2]]],
        },
      },
    ],
  }), []);

  const nigeriaStyle = () => ({
    fillColor: "#e6e6e6",
    color: "#bdbdbd",
    weight: 1,
    fillOpacity: 0.55,
  });

  const anambraStyle = (feature: any) => {
    const datasets = feature?.properties?.datasets || 0;
    const opacity = Math.min(datasets / 10, 1); // Scale opacity based on dataset count
    return {
      fillColor: datasets > 5 ? "#ffaa00" : datasets > 2 ? "#ffcc66" : "#ffe6b3",
      color: "#b36e00",
      weight: 2,
      fillOpacity: 0.7 + (opacity * 0.3),
    };
  };

  // Add dataset selection controls
  const datasetTypes = [
    { value: 'all', label: 'All Datasets' },
    { value: 'DHIS2', label: 'DHIS2 Data' },
    { value: 'GRID3', label: 'GRID3 Data' },
    { value: 'HFR', label: 'Health Facility Registry' },
    { value: 'NHMIS', label: 'NHMIS Data' },
  ];

  const handleDownloadSelectedArea = () => {
    if (selectedArea) {
      const datasets = healthDatasets.filter(d =>
        d.portal === selectedDatasetType ||
        (selectedDatasetType === 'all' && d.accessLevel === 'public')
      );
      console.log('Downloading datasets for selected area:', datasets);
      // In a real app, this would trigger actual downloads
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-inter font-bold mb-2">
              Health Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time insights into health indicators across Anambra State
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <Card key={i}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <p className={`text-sm ${metric.changeType === "increase" ? "text-green-600" : "text-red-600"}`}>
                      {metric.change}
                    </p>
                  </div>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Disease Trends Over Time</CardTitle>
              <CardDescription>Monthly case reports for major diseases in 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={diseaseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="malaria" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="hiv" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="tb" stroke="#10b981" />
                    <Line type="monotone" dataKey="ntd" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cases by Local Government Area</CardTitle>
              <CardDescription>Disease burden across all 21 LGAs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lgaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cases" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Facility Distribution + Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Health Facility Distribution</CardTitle>
              <CardDescription>Breakdown by facility type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={facilityData} dataKey="value" nameKey="name" outerRadius={120} label>
                      {facilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
              <CardDescription>Key performance indicators for this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <li><strong>85%</strong> Immunization Coverage</li>
                <li><strong>92%</strong> Skilled Birth Attendance</li>
                <li><strong>78%</strong> ANC Coverage</li>
                <li><strong>96%</strong> Data Completeness</li>
              </ul>
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Malaria cases show seasonal increase during rainy season</li>
                <li>Onitsha North reports highest case burden due to population density</li>
                <li>Primary health centers cover 87% of health service delivery</li>
                <li>Data reporting compliance improved by 12% this quarter</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>Interactive Data Portal Map</CardTitle>
                <CardDescription>Click LGAs to view available datasets and download data directly.</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <Select value={selectedDatasetType} onValueChange={setSelectedDatasetType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Select Dataset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasetTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={drawMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDrawMode(!drawMode)}
                >
                  <Square className="h-4 w-4 mr-2" />
                  {drawMode ? "Exit Selection" : "Select Area"}
                </Button>
                {selectedArea && (
                  <Button variant="outline" size="sm" onClick={handleDownloadSelectedArea}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Selected
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] md:h-[560px] w-full rounded-lg overflow-hidden">
              <MapContainer center={[6.25, 6.92]} zoom={8} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON
                  data={nigeriaGeoJSON}
                  pathOptions={{
                    fillColor: "#e6e6e6",
                    color: "#bdbdbd",
                    weight: 1,
                    fillOpacity: 0.55,
                  }}
                />
                <GeoJSON
                  data={anambraGeoJSON}
                  pathOptions={(feature: any) => {
                    const datasets = feature?.properties?.datasets || 0;
                    const opacity = Math.min(datasets / 10, 1);
                    return {
                      fillColor: datasets > 5 ? "#ffaa00" : datasets > 2 ? "#ffcc66" : "#ffe6b3",
                      color: "#b36e00",
                      weight: 2,
                      fillOpacity: 0.7 + (opacity * 0.3),
                    };
                  }}
                  onEachFeature={(feature: Feature<Polygon, any>, layer: any) => {
                    if (!feature.properties) return;
                    const { name, datasets, portal, category } = feature.properties;

                    layer.bindTooltip(`
                      <strong>${name}</strong><br/>
                      <strong>Datasets Available:</strong> ${datasets}<br/>
                      <strong>Primary Portal:</strong> ${portal}<br/>
                      <strong>Category:</strong> ${category}
                    `, { sticky: true });

                    layer.on('click', () => {
                      setSelectedLGA(name);
                    });
                  }}
                />
              </MapContainer>
            </div>
            {selectedLGA && (
              <div className="mt-4 p-4 bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-lg">
                <h4 className="font-semibold text-[#ffaa00] mb-2">Selected LGA: {selectedLGA}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Available datasets in this area will be shown here.
                </p>
                <Button size="sm" onClick={() => setSelectedLGA(null)}>
                  Clear Selection
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapViewPage;



