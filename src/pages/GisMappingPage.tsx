import React, { useState } from 'react';
import { Layers, Filter, Search, Download, ZoomIn, ZoomOut, Maximize, Minimize, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GisMappingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Layer states
  const [layers, setLayers] = useState({
    healthFacilities: true,
    schools: false,
    roads: true,
    waterBodies: true,
    boundaries: true,
  });

  // Filter states
  const [filters, setFilters] = useState({
    facilityType: 'all',
    dateRange: 'all',
    status: 'all',
  });

  const toggleLayer = (layer: string) => {
    setLayers(prev => ({
      ...prev,
      [layer]: !prev[layer as keyof typeof prev]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Layers & Filters</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8"
            >
              <Minimize className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="layers" className="p-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="layers">
              <Layers className="h-4 w-4 mr-2" />
              Layers
            </TabsTrigger>
            <TabsTrigger value="filters">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="layers" className="mt-4 space-y-2">
            {Object.entries(layers).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                <Checkbox 
                  id={key}
                  checked={value} 
                  onCheckedChange={() => toggleLayer(key)}
                />
                <label 
                  htmlFor={key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {key.split(/(?=[A-Z])/).join(' ')}
                </label>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="filters" className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Facility Type</h3>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.facilityType}
                onChange={(e) => setFilters({...filters, facilityType: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="hospital">Hospitals</option>
                <option value="clinic">Clinics</option>
                <option value="pharmacy">Pharmacies</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Date Range</h3>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">This Year</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Status</h3>
              <select 
                className="w-full p-2 border rounded text-sm"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {!isSidebarOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(true)}
                className="h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-lg font-semibold">Anambra GIS Mapping</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Container - Placeholder for QGIS Map */}
        <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
          <div className="text-center p-8 max-w-2xl">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-4">
              <MapPin className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">GIS Mapping Interface</h2>
            <p className="text-gray-600 mb-6">
              This area is reserved for the QGIS map visualization. The map will be integrated here once the QGIS team completes their work.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white">
              <p className="text-gray-500 italic">
                QGIS Map will be displayed here
              </p>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 space-y-2">
            <Button variant="outline" size="icon" className="h-10 w-10 shadow-md">
              <Layers className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 shadow-md">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisMappingPage;
