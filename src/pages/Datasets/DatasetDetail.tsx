import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Download, ExternalLink, FileText } from "lucide-react";
import DatasetMetadataTable from "@/components/DatasetMetadataTable";
import { getDatasetById } from "@/data/datasets";

const DatasetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dataset = id ? getDatasetById(id) : null;

  if (!dataset) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Dataset Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The requested dataset could not be found.
          </p>
          <Button asChild>
            <Link to="/datasets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data Portal
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Spatial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Non-spatial':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Hybrid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Spatial + Attribute':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccessColor = (accessLevel: string) => {
    switch (accessLevel) {
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'restricted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/datasets">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Data Portal
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#ffaa00] rounded-lg flex items-center justify-center shadow-amber">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-2">
                  {dataset.dataset}
                </h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getTypeColor(dataset.type)}>
                    {dataset.type}
                  </Badge>
                  <Badge variant="outline" className={getAccessColor(dataset.accessLevel)}>
                    {dataset.accessLevel} access
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Portal: <span className="font-medium text-[#ffaa00]">{dataset.portal}</span> • {dataset.subcategory}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="border-[#ffaa00]/20 text-[#ffaa00] hover:bg-[#ffaa00]/5">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button className="bg-[#ffaa00] hover:bg-[#e69900] text-white">
                <ExternalLink className="mr-2 h-4 w-4" />
                Access Data
              </Button>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-[#ffaa00]" />
                  <span>Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {dataset.description}
                </p>
              </CardContent>
            </Card>

            {/* Metadata Table */}
            <DatasetMetadataTable
              attributes={dataset.attributes}
              custodian={dataset.custodian || dataset.owner}
              updateFrequency={dataset.updateFrequency || dataset.refresh}
              citation={dataset.citation || `${dataset.owner}, ${dataset.dataset}, 2024`}
              usage={dataset.usage}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Datasets */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Datasets</CardTitle>
                <CardDescription>
                  Other datasets from {dataset.portal}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    to="/datasets"
                    className="block p-2 rounded border hover:border-[#ffaa00]/50 hover:bg-[#ffaa00]/5 transition-colors"
                  >
                    <div className="text-sm font-medium">View all {dataset.portal} datasets</div>
                    <div className="text-xs text-muted-foreground">
                      Browse datasets from the same portal
                    </div>
                  </Link>

                  <Link
                    to={`/datasets?portal=${dataset.portal}&subcategory=${dataset.subcategory}`}
                    className="block p-2 rounded border hover:border-[#ffaa00]/50 hover:bg-[#ffaa00]/5 transition-colors"
                  >
                    <div className="text-sm font-medium">View {dataset.subcategory} datasets</div>
                    <div className="text-xs text-muted-foreground">
                      Browse datasets from the same category
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;
