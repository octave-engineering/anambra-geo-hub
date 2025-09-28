import { useState } from "react";
import DatasetTable from "@/components/DatasetTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground">
                Data Repository
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
            <Button variant="link" className="ml-2 p-0 h-auto text-primary">
              Login for more datasets
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