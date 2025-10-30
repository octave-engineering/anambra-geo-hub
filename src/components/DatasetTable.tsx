import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, Eye, Info } from "lucide-react";
import { healthDatasets, Dataset } from "@/data/datasets";
import { toast } from "@/hooks/use-toast";

interface DatasetTableProps {
  userAccessLevel?: 'public' | 'restricted' | 'admin';
}

const DatasetTable = ({ userAccessLevel = 'public' }: DatasetTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

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

  const handleMoreInfo = (dataset: Dataset) => {
    setSelectedDataset(dataset);
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
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {dataset.description}
              </p>

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
                {dataset.koboFormUrl && (
                  <Button asChild variant="secondary" size="sm" className="flex-1">
                    <a href={dataset.koboFormUrl} target="_blank" rel="noreferrer">
                      Collect (Kobo)
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMoreInfo(dataset)}
                  title="More Information"
                >
                  <Info className="h-4 w-4" />
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

      {/* More Info Modal/Tooltip */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{selectedDataset.dataset}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDataset(null)}
                >
                  ✕
                </Button>
              </div>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Owner:</strong> {selectedDataset.owner}</div>
                        <div><strong>Format:</strong> {selectedDataset.format}</div>
                        <div><strong>Size:</strong> {selectedDataset.size}</div>
                        <div><strong>Last Updated:</strong> {new Date(selectedDataset.lastUpdated).toLocaleDateString()}</div>
                        <div><strong>Access Level:</strong>
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            selectedDataset.accessLevel === 'public' ? 'bg-green-100 text-green-800' :
                            selectedDataset.accessLevel === 'restricted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {selectedDataset.accessLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2">Technical Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Type:</strong> {selectedDataset.type}</div>
                        <div><strong>Source:</strong> {selectedDataset.source}</div>
                        <div><strong>Custodian:</strong> {selectedDataset.custodian}</div>
                        <div><strong>Update Frequency:</strong> {selectedDataset.updateFrequency}</div>
                        <div><strong>Portal:</strong> {selectedDataset.portal}</div>
                        <div><strong>Category:</strong> {selectedDataset.subcategory}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
                  </div>

                  {/* Usage */}
                  {selectedDataset.usage && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Usage</h4>
                      <p className="text-sm text-muted-foreground">{selectedDataset.usage}</p>
                    </div>
                  )}

                  {/* Citation */}
                  {selectedDataset.citation && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Citation</h4>
                      <p className="text-sm text-muted-foreground italic">"{selectedDataset.citation}"</p>
                    </div>
                  )}

                  {/* Attributes */}
                  {selectedDataset.attributes && selectedDataset.attributes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Key Attributes</h4>
                      <div className="space-y-2">
                        {selectedDataset.attributes.map((attr, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-sm">{attr.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Example: {attr.exampleValue}
                            </div>
                            <div className="text-xs text-muted-foreground">{attr.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DatasetTable;