import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, File, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SubmitDataPage = () => {
  const [formData, setFormData] = useState({
    datasetName: "",
    organization: "",
    category: "",
    format: "",
    description: "",
    contactEmail: "",
    refreshFrequency: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "disease", label: "Disease Data" },
    { value: "facility", label: "Health Facilities" },
    { value: "population", label: "Population Data" },
    { value: "surveillance", label: "Disease Surveillance" },
  ];

  const formats = [
    { value: "csv", label: "CSV" },
    { value: "excel", label: "Excel (XLSX)" },
    { value: "geojson", label: "GeoJSON" },
    { value: "json", label: "JSON" },
    { value: "api", label: "API Endpoint" },
  ];

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annual", label: "Annual" },
    { value: "adhoc", label: "Ad hoc" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      toast({
        title: "Dataset Submitted Successfully",
        description: "Your dataset submission has been received and is under review.",
      });
      
      // Reset form
      setFormData({
        datasetName: "",
        organization: "",
        category: "",
        format: "",
        description: "",
        contactEmail: "",
        refreshFrequency: "",
      });
      setFile(null);
      setIsSubmitting(false);
    }, 2000);
  };

  const requirements = [
    "Data must be anonymized and comply with health data privacy regulations",
    "Include metadata documentation describing data structure and variables",
    "Ensure data quality and completeness before submission",
    "Provide contact information for data stewardship and updates",
    "Data should be relevant to Anambra State health system or population",  
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-amber">
              <Upload className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-inter font-bold text-foreground">
                Submit Health Data
              </h1>
              <p className="text-muted-foreground">
                Contribute to Anambra State's health data repository
              </p>
            </div>
          </div>
        </div>

        {/* Information Alert */}
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Data Submission Process:</strong> All submitted datasets undergo review by the 
            Anambra State Ministry of Health before being added to the public repository. 
            You will be notified via email about the status of your submission.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Information</CardTitle>
                <CardDescription>
                  Provide details about the health dataset you want to contribute
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dataset Name */}
                  <div className="space-y-2">
                    <Label htmlFor="datasetName">Dataset Name *</Label>
                    <Input
                      id="datasetName"
                      placeholder="e.g., Malaria Cases Q4 2024"
                      value={formData.datasetName}
                      onChange={(e) => handleInputChange("datasetName", e.target.value)}
                      required
                    />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      placeholder="e.g., Anambra State Ministry of Health"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                      required
                    />
                  </div>

                  {/* Category and Format */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Data Format *</Label>
                      <Select value={formData.format} onValueChange={(value) => handleInputChange("format", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Refresh Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Update Frequency *</Label>
                    <Select value={formData.refreshFrequency} onValueChange={(value) => handleInputChange("refreshFrequency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How often is this data updated?" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the dataset, its content, methodology, and potential uses..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Contact Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@organization.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="file">Dataset File</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground mb-2">
                          {file ? (
                            <div className="flex items-center justify-center space-x-2">
                              <File className="h-4 w-4" />
                              <span>{file.name}</span>
                            </div>
                          ) : (
                            "Drop your file here or click to browse"
                          )}
                        </div>
                        <Input
                          type="file"
                          accept=".csv,.xlsx,.json,.geojson"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: CSV, Excel, JSON, GeoJSON (Max 50MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Upload className="h-4 w-4" />
                        <span>Submit Dataset</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Submission Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <span>Review Process</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</div>
                    <div>
                      <div className="font-medium text-sm">Initial Review</div>
                      <div className="text-xs text-muted-foreground">Technical validation and completeness check</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</div>
                    <div>
                      <div className="font-medium text-sm">Quality Assessment</div>
                      <div className="text-xs text-muted-foreground">Data quality and relevance evaluation</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</div>
                    <div>
                      <div className="font-medium text-sm">Approval & Integration</div>
                      <div className="text-xs text-muted-foreground">Final approval and repository integration</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our data team for assistance with your submission.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitDataPage;