import { useState } from "react";
import { Link } from "react-router-dom";
import DatasetTable from "@/components/DatasetTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, Eye, Filter, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RepositoryPage = () => {
  const [userAccessLevel] = useState<'public' | 'restricted' | 'admin'>('public');

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Database className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">20+</div>
                    <div className="text-sm text-muted-foreground">Total Datasets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Download className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">500+</div>
                    <div className="text-sm text-muted-foreground">Total Downloads</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Eye className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-sm text-muted-foreground">Public Access</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Access Level Notice */}
        <Alert className="mb-6">
          <HelpCircle className="h-4 w-4" />
          <AlertDescription>
            You are viewing datasets with <strong>Public Access</strong>.
            <Button variant="link" className="ml-2 p-0 h-auto text-primary" asChild>
              <Link to="/login">Login for more datasets</Link>
            </Button>
          </AlertDescription>
        </Alert>


        {/* Dataset Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-red-500">
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
          
          <Card className="border-l-4 border-l-blue-500">
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
          
          <Card className="border-l-4 border-l-green-500">
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
          
          <Card className="border-l-4 border-l-purple-500">
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

        {/* Dataset Table */}
        <DatasetTable userAccessLevel={userAccessLevel} />

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
              <Card className="border-l-4 border-l-blue-500">
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
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

              <Card className="border-l-4 border-l-gray-500">
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
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
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">Monthly</div>
                      <div className="text-sm text-green-600 mb-2">Most Current</div>
                      <div className="text-xs text-muted-foreground">
                        DHIS2, Disease Units, Immunization
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">Quarterly</div>
                      <div className="text-sm text-blue-600 mb-2">Regular Updates</div>
                      <div className="text-xs text-muted-foreground">
                        Maternal/Child Health, Referrals
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-700">Annual</div>
                      <div className="text-sm text-orange-600 mb-2">Baseline Data</div>
                      <div className="text-xs text-muted-foreground">
                        GRID3, HFR, Population Data
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Access Level Guide */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Access Level Recommendations</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="font-medium text-green-700">Public Access (Recommended for beginners)</div>
                    <div className="text-sm text-muted-foreground">
                      Start with these datasets for research, analysis, and basic mapping. No special permissions required.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="font-medium text-yellow-700">Restricted Access (For authorized users)</div>
                    <div className="text-sm text-muted-foreground">
                      Access sensitive health data with proper credentials. Contains detailed surveillance and laboratory data.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <div className="font-medium text-red-700">Admin Access (Limited datasets)</div>
                    <div className="text-sm text-muted-foreground">
                      Internal administrative data including HR registries and drug stock information. Requires high-level permissions.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Portal Comparison */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Data Portal Characteristics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-700">DHIS2</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      Real-time health service data with monthly updates. Best for operational monitoring and program management.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700">NHMIS</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      National health management system with comprehensive surveillance data. Restricted access for sensitive information.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-700">GRID3</CardTitle>
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Choosing the Right Dataset</h4>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>For Mapping & Planning:</strong> Use GRID3 and HFR datasets (spatial data with annual updates)</p>
                <p><strong>For Trend Analysis:</strong> Choose DHIS2 datasets (monthly updates, comprehensive coverage)</p>
                <p><strong>For Research:</strong> Start with public access datasets, then request restricted access if needed</p>
                <p><strong>For Operational Use:</strong> Use monthly/quarterly datasets for real-time monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Data Usage Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Public Access Data</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Can be used for research and analysis</li>
                  <li>• Attribution to Anambra State Government required</li>
                  <li>• No commercial use without permission</li>
                  <li>• Share derived insights with the community</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Restricted Data</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Requires approved access credentials</li>
                  <li>• Subject to data sharing agreements</li>
                  <li>• May contain sensitive health information</li>
                  <li>• Contact admin for access requests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepositoryPage;