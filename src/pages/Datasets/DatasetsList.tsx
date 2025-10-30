import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Database, ArrowLeft } from "lucide-react";
import DatasetCard from "@/components/DatasetCard";
import { healthDatasets, getDatasetsByCategory, getDatasetsByAccessLevel, getDatasetById, getDatasetsByPortal, getUniquePortals, groupDatasetsByPortal } from "@/data/datasets";

const DatasetsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPortal, setSelectedPortal] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>("all");

  // Filter datasets based on search and filters
  const filteredDatasets = healthDatasets.filter(dataset => {
    const matchesSearch = dataset.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (dataset.source && dataset.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         dataset.subcategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPortal = selectedPortal === "all" || dataset.portal === selectedPortal;
    const matchesSubcategory = selectedSubcategory === "all" || dataset.subcategory === selectedSubcategory;
    const matchesAccess = selectedAccessLevel === "all" || dataset.accessLevel === selectedAccessLevel;

    return matchesSearch && matchesPortal && matchesSubcategory && matchesAccess;
  });

  // Get unique portals and subcategories for filters
  const uniquePortals = getUniquePortals();
  const accessLevels = ['public', 'restricted', 'admin'];

  // Group datasets by portal for display
  const datasetsByPortal = selectedPortal === "all"
    ? groupDatasetsByPortal()
    : {
        [selectedPortal]: Object.fromEntries(
          Object.entries(groupDatasetsByPortal()[selectedPortal] || {}).map(([subcategory, datasets]) => [
            subcategory,
            datasets.filter(d => d.subcategory === subcategory && filteredDatasets.includes(d))
          ])
        )
      };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#ffaa00] rounded-lg flex items-center justify-center shadow-amber">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-inter font-bold text-foreground">
                Data Portal
              </h1>
              <p className="text-muted-foreground">
                Health datasets organized by data portals and thematic categories
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-[#ffaa00]" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">{healthDatasets.length}</div>
                    <div className="text-sm text-muted-foreground">Total Datasets</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">P</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {uniquePortals.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Portals</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">S</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {healthDatasets.filter(d => d.type === 'Spatial' || d.type === 'Spatial + Attribute').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Spatial Data</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">M</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {healthDatasets.filter(d => d.accessLevel === 'public').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Public Access</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-[#ffaa00]" />
              <span>Search & Filter Datasets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedPortal} onValueChange={setSelectedPortal}>
                <SelectTrigger>
                  <SelectValue placeholder="All Portals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Portals</SelectItem>
                  {uniquePortals.map(portal => (
                    <SelectItem key={portal} value={portal}>{portal}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Access Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Levels</SelectItem>
                  {accessLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {selectedPortal !== "all" && Object.keys(datasetsByPortal[selectedPortal] || {}).map(subcategory => (
                    <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDatasets.length} of {healthDatasets.length} datasets
          </p>
        </div>

        {/* Dataset Cards by Portal */}
        {Object.entries(datasetsByPortal).map(([portal, subcategories]) => (
          Object.keys(subcategories).length > 0 && (
            <div key={portal} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-2xl font-inter font-bold text-foreground">
                  {portal}
                </h2>
                <Badge variant="outline" className="bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/20">
                  {Object.values(subcategories).flat().length} datasets
                </Badge>
              </div>

              {Object.entries(subcategories).map(([subcategory, datasets]) => (
                datasets.length > 0 && (
                  <div key={subcategory} className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {subcategory}
                      </h3>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                        {datasets.length} datasets
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {datasets.map(dataset => (
                        <DatasetCard key={dataset.id} dataset={dataset} />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )
        ))}

        {/* No Results */}
        {filteredDatasets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No datasets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPortal("all");
                  setSelectedAccessLevel("all");
                  setSelectedSubcategory("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DatasetsList;
