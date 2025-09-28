import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, Eye, Calendar, HardDrive } from "lucide-react";
import { healthDatasets, Dataset } from "@/data/datasets";
import { toast } from "@/hooks/use-toast";

interface DatasetTableProps {
  userAccessLevel?: 'public' | 'restricted' | 'admin';
}

const DatasetTable = ({ userAccessLevel = 'public' }: DatasetTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");

  // Filter datasets based on user access level
  const accessibleDatasets = healthDatasets.filter(dataset => {
    if (userAccessLevel === 'admin') return true;
    if (userAccessLevel === 'restricted') return dataset.accessLevel !== 'admin';
    return dataset.accessLevel === 'public';
  });

  // Apply search and filters
  const filteredDatasets = accessibleDatasets.filter(dataset => {
    const matchesSearch = dataset.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || dataset.category === categoryFilter;
    const matchesFormat = formatFilter === 'all' || dataset.format.toLowerCase().includes(formatFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleDownload = (dataset: Dataset) => {
    // Simulate download with toast notification
    toast({
      title: "Download Started",
      description: `Downloading ${dataset.dataset} (${dataset.size})`,
    });
    
    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${dataset.downloadUrl}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'disease': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'facility': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'population': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'surveillance': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'restricted': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
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
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="disease">Disease Data</SelectItem>
                <SelectItem value="facility">Health Facilities</SelectItem>
                <SelectItem value="population">Population</SelectItem>
                <SelectItem value="surveillance">Surveillance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="geojson">GeoJSON</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground flex items-center">
              <Eye className="h-4 w-4 mr-2 text-primary" />
              {filteredDatasets.length} datasets found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card key={dataset.id} className="hover:shadow-card transition-all duration-200 border hover:border-primary/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{dataset.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{dataset.dataset}</CardTitle>
                    <p className="text-sm text-muted-foreground">{dataset.owner}</p>
                  </div>
                </div>
                <Badge className={getAccessLevelColor(dataset.accessLevel)}>
                  {dataset.accessLevel}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dataset.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{dataset.format}</Badge>
                <Badge className={getCategoryColor(dataset.category)}>
                  {dataset.category}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{dataset.refresh}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <HardDrive className="h-4 w-4" />
                  <span>{dataset.size}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(dataset.lastUpdated).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleDownload(dataset)}
                  className="flex-1"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No datasets found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatasetTable;