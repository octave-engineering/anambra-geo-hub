import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, ArrowRight, Info } from "lucide-react";
import { Dataset } from "@/data/datasets";

interface DatasetCardProps {
  dataset: Dataset;
}

const DatasetCard = ({ dataset }: DatasetCardProps) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#ffaa00] hover:border-l-[#e69900]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-[#ffaa00]" />
            </div>
          </div>
          <CardTitle className="text-lg group-hover:text-[#ffaa00] transition-colors">
            {dataset.dataset}
          </CardTitle>
          <CardDescription className="text-sm">
            <span className="font-medium text-[#ffaa00]">{dataset.portal}</span> • {dataset.subcategory}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {dataset.description}
          </p>

          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-[#ffaa00] hover:bg-[#e69900] text-white group-hover:shadow-md transition-all duration-300">
              <Link to={`/datasets/${dataset.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(true)}
              title="More Information"
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* More Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{dataset.dataset}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInfo(false)}
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
                        <div><strong>Owner:</strong> {dataset.owner}</div>
                        <div><strong>Format:</strong> {dataset.format}</div>
                        <div><strong>Size:</strong> {dataset.size}</div>
                        <div><strong>Last Updated:</strong> {new Date(dataset.lastUpdated).toLocaleDateString()}</div>
                        <div><strong>Access Level:</strong>
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            dataset.accessLevel === 'public' ? 'bg-[#ffaa00]/20 text-[#ffaa00]' :
                            dataset.accessLevel === 'restricted' ? 'bg-[#ffaa00]/30 text-[#ffaa00]/80' :
                            'bg-[#ffaa00]/40 text-[#ffaa00]/70'
                          }`}>
                            {dataset.accessLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#ffaa00] mb-2">Technical Details</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Type:</strong> {dataset.type}</div>
                        <div><strong>Source:</strong> {dataset.source}</div>
                        <div><strong>Custodian:</strong> {dataset.custodian}</div>
                        <div><strong>Update Frequency:</strong> {dataset.updateFrequency}</div>
                        <div><strong>Portal:</strong> {dataset.portal}</div>
                        <div><strong>Category:</strong> {dataset.subcategory}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-[#ffaa00] mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{dataset.description}</p>
                  </div>

                  {/* Usage */}
                  {dataset.usage && (
                    <div>
                      <h4 className="font-semibold text-[#ffaa00] mb-2">Usage</h4>
                      <p className="text-sm text-muted-foreground">{dataset.usage}</p>
                    </div>
                  )}

                  {/* Citation */}
                  {dataset.citation && (
                    <div>
                      <h4 className="font-semibold text-[#ffaa00] mb-2">Citation</h4>
                      <p className="text-sm text-muted-foreground italic">"{dataset.citation}"</p>
                    </div>
                  )}

                  {/* Attributes */}
                  {dataset.attributes && dataset.attributes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[#ffaa00] mb-2">Key Attributes</h4>
                      <div className="space-y-2">
                        {dataset.attributes.map((attr, index) => (
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
    </>
  );
};

export default DatasetCard;
