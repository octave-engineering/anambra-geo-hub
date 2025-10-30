import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Calendar, Quote } from "lucide-react";

interface DatasetAttribute {
  name: string;
  exampleValue: string;
  description: string;
}

interface DatasetMetadataTableProps {
  attributes?: DatasetAttribute[];
  custodian: string;
  updateFrequency: string;
  citation: string;
  usage?: string;
}

const DatasetMetadataTable = ({
  attributes,
  custodian,
  updateFrequency,
  citation,
  usage
}: DatasetMetadataTableProps) => {
  return (
    <div className="space-y-6">
      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Users className="h-4 w-4 text-[#ffaa00]" />
              <span>Custodian</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{custodian}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#ffaa00]" />
              <span>Update Frequency</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{updateFrequency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Quote className="h-4 w-4 text-[#ffaa00]" />
              <span>Citation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{citation}</p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Section */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#ffaa00]" />
              <span>Usage Considerations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{usage}</p>
          </CardContent>
        </Card>
      )}

      {/* Attributes Table */}
      {attributes && attributes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#ffaa00]" />
              <span>Dataset Attributes</span>
            </CardTitle>
            <CardDescription>
              Key data fields and their descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Attribute Name</TableHead>
                    <TableHead className="font-semibold">Example Value</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributes.map((attr, index) => (
                    <TableRow key={index} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-sm bg-muted/20">
                        {attr.name}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {attr.exampleValue}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {attr.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatasetMetadataTable;
