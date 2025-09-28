

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Map as MapIcon,
  Activity,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { FeatureCollection, Feature, Polygon } from "geojson";

const AnalyticsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("2024");

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
    { name: "Aguata", coord: [7.09, 6.03], cases: { malaria: 120, hiv: 8, tb: 4 } },
    { name: "Anaocha", coord: [6.95, 6.17], cases: { malaria: 150, hiv: 6, tb: 8 } },
    { name: "Anambra East", coord: [7.66, 6.18], cases: { malaria: 60, hiv: 3, tb: 2 } },
    { name: "Anambra West", coord: [6.40, 6.56], cases: { malaria: 200, hiv: 12, tb: 5 } },
    { name: "Awka North", coord: [7.01, 6.36], cases: { malaria: 110, hiv: 4, tb: 3 } },
    { name: "Awka South", coord: [7.07, 6.21], cases: { malaria: 95, hiv: 5, tb: 2 } },
    { name: "Ayamelum", coord: [6.50, 6.40], cases: { malaria: 25, hiv: 1, tb: 0 } },
    { name: "Dunukofia", coord: [6.90, 6.25], cases: { malaria: 70, hiv: 2, tb: 1 } },
    { name: "Ekwusigo", coord: [6.96, 6.08], cases: { malaria: 160, hiv: 9, tb: 3 } },
    { name: "Idemili North", coord: [6.83, 6.22], cases: { malaria: 180, hiv: 6, tb: 4 } },
    { name: "Idemili South", coord: [6.80, 6.15], cases: { malaria: 140, hiv: 5, tb: 3 } },
    { name: "Ihiala", coord: [6.09, 5.98], cases: { malaria: 170, hiv: 7, tb: 6 } },
    { name: "Njikoka", coord: [7.03, 6.18], cases: { malaria: 45, hiv: 2, tb: 1 } },
    { name: "Nnewi North", coord: [6.03, 6.01], cases: { malaria: 95, hiv: 4, tb: 2 } },
    { name: "Nnewi South", coord: [6.02, 5.90], cases: { malaria: 120, hiv: 6, tb: 2 } },
    { name: "Ogbaru", coord: [6.75, 5.95], cases: { malaria: 80, hiv: 3, tb: 1 } },
    { name: "Onitsha North", coord: [6.78, 6.16], cases: { malaria: 220, hiv: 11, tb: 6 } },
    { name: "Onitsha South", coord: [6.80, 6.14], cases: { malaria: 170, hiv: 9, tb: 4 } },
    { name: "Orumba North", coord: [7.18, 6.02], cases: { malaria: 40, hiv: 2, tb: 1 } },
    { name: "Orumba South", coord: [7.22, 5.95], cases: { malaria: 75, hiv: 3, tb: 1 } },
    { name: "Oyi", coord: [7.13, 6.33], cases: { malaria: 50, hiv: 1, tb: 0 } },
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
        properties: { name: lga.name, cases: lga.cases },
        geometry: { type: "Polygon", coordinates: makeSquarePolygon(lga.coord[0], lga.coord[1], 0.03) },
      })),
    };
  }, []);

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

  const anambraStyle = () => ({
    fillColor: "#ffaa00",
    color: "#b36e00",
    weight: 2,
    fillOpacity: 0.85,
  });

  const anambraOnEach = (feature: Feature<Polygon, any>, layer: any) => {
    if (!feature.properties) return;
    const { name, cases } = feature.properties;
    layer.bindPopup(`
      <strong>${name}</strong>
      <table>
        <tr><td>Malaria</td><td>${cases.malaria}</td></tr>
        <tr><td>HIV</td><td>${cases.hiv}</td></tr>
        <tr><td>TB</td><td>${cases.tb}</td></tr>
      </table>
    `);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-2">
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
            <CardTitle>Interactive Map of Nigeria (Anambra Focus)</CardTitle>
            <CardDescription>Click LGAs to view demo disease breakdowns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] md:h-[560px] w-full rounded-lg overflow-hidden">
              <MapContainer center={[6.25, 6.92]} zoom={8} scrollWheelZoom className="h-full w-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={nigeriaGeoJSON} style={nigeriaStyle} />
                <GeoJSON data={anambraGeoJSON} style={anambraStyle} onEachFeature={anambraOnEach} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;



