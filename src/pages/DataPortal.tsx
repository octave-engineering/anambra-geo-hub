import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Search, Database, Info } from "lucide-react";
import { healthDatasets } from "@/data/datasets";
import { toast } from "@/hooks/use-toast";

const DataPortal = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDataset, setSelectedDataset] = useState<any | null>(null);

  // Filter datasets based on search term
  const filteredDatasets = healthDatasets.filter(dataset => {
    return dataset.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
           dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (dataset.source && dataset.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
           dataset.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDownload = (dataset: any) => {
    // Simulate download with toast notification
    toast({
      title: "Download Started",
      description: `Downloading ${dataset.dataset} (${dataset.size})`,
    });

    // In a real app, this would trigger the actual download
    console.log(`Downloading: ${dataset.downloadUrl}`);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-amber">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-inter font-bold text-foreground">
                Data Portal
              </h1>
              <p className="text-muted-foreground">
                Comprehensive health datasets for Anambra State
              </p>
            </div>
          </div>

          {/* Dataset Categories */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-l-4 border-l-[#ffaa00]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>🦠</span>
                  <span>Disease Data</span>
                </CardTitle>
                <CardDescription>
                  HIV, TB, Malaria, NTDs, and other disease surveillance data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[#ffaa00]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>🏥</span>
                  <span>Health Facilities</span>
                </CardTitle>
                <CardDescription>
                  DHIS2, PHC Registry, and facility infrastructure data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[#ffaa00]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>👥</span>
                  <span>Population</span>
                </CardTitle>
                <CardDescription>
                  Demographics, projections, and community survey data
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-[#ffaa00]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>🔍</span>
                  <span>Surveillance</span>
                </CardTitle>
                <CardDescription>
                  NHMIS, lab results, and disease surveillance systems
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
          
        </div>

        {/* Search and Datasets */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-inter font-bold text-foreground">
              Available Datasets
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredDatasets.length} datasets found
            </div>
          </div>
          
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Datasets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map(dataset => (
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedDataset(dataset)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {dataset.description}
                  </p>

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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredDatasets.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No datasets found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Data Quality and Comparisons */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>Data Quality and Comparisons</span>
            </CardTitle>
            <CardDescription>
              Understanding dataset characteristics to help you choose the most suitable data for your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Spatial vs Non-Spatial Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-[#ffaa00]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>🗺️</span>
                    <span>Spatial Data</span>
                  </CardTitle>
                  <CardDescription>
                    Datasets with geographic coordinates and mapping capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#ffaa00] rounded-full"></div>
                      <span className="text-sm font-medium">Strengths</span>
                    </div>
                    <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                      <li>• Perfect for mapping and visualization</li>
                      <li>• Enables spatial analysis and hotspot identification</li>
                      <li>• Supports geographic decision-making</li>
                      <li>• Compatible with GIS software (QGIS, ArcGIS)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#ffaa00]/70 rounded-full"></div>
                      <span className="text-sm font-medium">Considerations</span>
                    </div>
                    <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                      <li>• Larger file sizes (5-45MB)</li>
                      <li>• Requires GIS skills for full utilization</li>
                      <li>• Limited to public access datasets</li>
                      <li>• Annual updates (less frequent)</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm font-medium text-primary mb-2">Best For:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Mapping</Badge>
                      <Badge variant="outline" className="text-xs">Analysis</Badge>
                      <Badge variant="outline" className="text-xs">Planning</Badge>
                      <Badge variant="outline" className="text-xs">Visualization</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#ffaa00]/80">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>📊</span>
                    <span>Non-Spatial Data</span>
                  </CardTitle>
                  <CardDescription>
                    Tabular datasets without geographic coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#ffaa00] rounded-full"></div>
                      <span className="text-sm font-medium">Strengths</span>
                    </div>
                    <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                      <li>• Smaller file sizes (3-15MB)</li>
                      <li>• Easier to analyze in Excel/spreadsheets</li>
                      <li>• More frequent updates (monthly/weekly)</li>
                      <li>• Available at all access levels</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#ffaa00]/70 rounded-full"></div>
                      <span className="text-sm font-medium">Limitations</span>
                    </div>
                    <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                      <li>• Cannot be mapped directly</li>
                      <li>• Limited spatial analysis capabilities</li>
                      <li>• May require data linking for mapping</li>
                      <li>• Less suitable for geographic planning</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm font-medium text-primary mb-2">Best For:</div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Statistics</Badge>
                      <Badge variant="outline" className="text-xs">Trends</Badge>
                      <Badge variant="outline" className="text-xs">Reporting</Badge>
                      <Badge variant="outline" className="text-xs">Excel Analysis</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Update Frequency Comparison */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Update Frequency Guide</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border border-[#ffaa00]/30 bg-[#ffaa00]/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa00]">Monthly</div>
                      <div className="text-sm text-[#ffaa00]/80 mb-2">Most Current</div>
                      <div className="text-xs text-muted-foreground">
                        DHIS2, Disease Units, Immunization
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#ffaa00]/30 bg-[#ffaa00]/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa00]">Quarterly</div>
                      <div className="text-sm text-[#ffaa00]/80 mb-2">Regular Updates</div>
                      <div className="text-xs text-muted-foreground">
                        Maternal/Child Health, Referrals
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#ffaa00]/30 bg-[#ffaa00]/5">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#ffaa00]">Annual</div>
                      <div className="text-sm text-[#ffaa00]/80 mb-2">Baseline Data</div>
                      <div className="text-xs text-muted-foreground">
                        GRID3, HFR, Population Data
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Data Portal Comparison */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Data Portal Characteristics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border border-[#ffaa00]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#ffaa00]">DHIS2</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      Real-time health service data with monthly updates. Best for operational monitoring and program management.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#ffaa00]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#ffaa00]">NHMIS</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      National health management system with comprehensive surveillance data. Restricted access for sensitive information.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#ffaa00]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#ffaa00]">GRID3</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      Population and boundary data with annual updates. Essential for planning and demographic analysis.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Choosing the Right Dataset */}
            <div className="bg-[#ffaa00]/10 border border-[#ffaa00]/20 rounded-lg p-4">
              <h4 className="font-semibold text-[#ffaa00] mb-2">💡 Choosing the Right Dataset</h4>
              <div className="text-sm text-[#ffaa00]/90 space-y-2">
                <p><strong>For Mapping & Planning:</strong> Use GRID3 and HFR datasets (spatial data with annual updates)</p>
                <p><strong>For Trend Analysis:</strong> Choose DHIS2 datasets (monthly updates, comprehensive coverage)</p>
                <p><strong>For Research:</strong> Start with public access datasets, then request restricted access if needed</p>
                <p><strong>For Operational Use:</strong> Use monthly/quarterly datasets for real-time monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Info Modal */}
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
                        <h4 className="font-semibold text-[#ffaa00] mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Owner:</strong> {selectedDataset.owner}</div>
                          <div><strong>Format:</strong> {selectedDataset.format}</div>
                          <div><strong>Size:</strong> {selectedDataset.size}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#ffaa00] mb-2">Technical Details</h4>
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
                      <h4 className="font-semibold text-[#ffaa00] mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedDataset.description}</p>
                    </div>

                    {/* Usage */}
                    {selectedDataset.usage && (
                      <div>
                        <h4 className="font-semibold text-[#ffaa00] mb-2">Usage</h4>
                        <p className="text-sm text-muted-foreground">{selectedDataset.usage}</p>
                      </div>
                    )}

                    {/* Citation */}
                    {selectedDataset.citation && (
                      <div>
                        <h4 className="font-semibold text-[#ffaa00] mb-2">Citation</h4>
                        <p className="text-sm text-muted-foreground italic">"{selectedDataset.citation}"</p>
                      </div>
                    )}

                    {/* Attributes */}
                    {selectedDataset.attributes && selectedDataset.attributes.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-[#ffaa00] mb-2">Key Attributes</h4>
                        <div className="space-y-2">
                          {selectedDataset.attributes.map((attr: any, index: number) => (
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

        {/* Dataset Comparison Section */}
        <div className="mt-12">
          <Card className="border-l-4 border-l-[#ffaa00]">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <span className="text-[#ffaa00] mr-2">🔍</span>
                Dataset Comparison Guide
              </CardTitle>
              <CardDescription>
                Understand the differences between similar datasets to choose the right one for your needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Disease Surveillance Datasets */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Disease Surveillance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Malaria Cases (DHIS2)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Strengths:</span> Monthly updates, facility-level granularity</p>
                      <p><span className="font-medium">Limitations:</span> Only includes public health facilities</p>
                      <p><span className="font-medium">Best for:</span> Real-time monitoring and response</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Malaria Prevalence (NMEP)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Strengths:</span> Community-level data, includes testing results</p>
                      <p><span className="font-medium">Limitations:</span> Annual updates, sample-based</p>
                      <p><span className="font-medium">Best for:</span> Annual planning and impact assessment</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Health Facility Datasets */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Health Facility Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Facility Registry (DHIS2)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Coverage:</span> All public health facilities</p>
                      <p><span className="font-medium">Update Frequency:</span> Monthly</p>
                      <p><span className="font-medium">Includes:</span> Services, staffing, equipment</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Private Facilities (HFR)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Coverage:</span> Selected private facilities</p>
                      <p><span className="font-medium">Update Frequency:</span> Quarterly</p>
                      <p><span className="font-medium">Includes:</span> Basic service availability</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Population Data */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Population Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Census Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Resolution:</span> LGA level</p>
                      <p><span className="font-medium">Update:</span> Every 10 years</p>
                      <p><span className="font-medium">Best for:</span> Official population counts</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">GRID3</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Resolution:</span> 100m grid cells</p>
                      <p><span className="font-medium">Update:</span> Annual estimates</p>
                      <p><span className="font-medium">Best for:</span> Spatial analysis</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#ffaa00]/5 border-[#ffaa00]/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">NMIS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><span className="font-medium">Coverage:</span> Facility catchments</p>
                      <p><span className="font-medium">Update:</span> Annual</p>
                      <p><span className="font-medium">Best for:</span> Health planning</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="bg-[#ffaa00]/10 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">How to Choose the Right Dataset</h4>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li className="flex items-start">
                    <span className="text-[#ffaa00] mr-2">•</span>
                    <span><strong>For real-time data:</strong> Use DHIS2 datasets with monthly updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ffaa00] mr-2">•</span>
                    <span><strong>For spatial analysis:</strong> Use GRID3 population data with health facility locations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ffaa00] mr-2">•</span>
                    <span><strong>For comprehensive coverage:</strong> Combine multiple data sources (e.g., DHIS2 + HFR)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ffaa00] mr-2">•</span>
                    <span><strong>For historical trends:</strong> Use datasets with longer time series</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DataPortal;
