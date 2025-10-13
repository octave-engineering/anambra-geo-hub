import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LgaMapLeaflet from "@/components/LgaMapLeaflet";

const ToolsPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-inter font-bold mb-2">Geospatial Tools</h1>
          <p className="text-muted-foreground">
            Curated tools for collecting, managing, and analyzing geospatial health data in Anambra State.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QGIS */}
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <CardTitle>QGIS (Open Source)</CardTitle>
              <CardDescription>Desktop GIS for editing, analysis, cartography</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Load vector/raster data (Shapefile, GeoJSON, TIFF)</li>
                <li>Project data to EPSG:4326 / UTM zones</li>
                <li>Join health attributes to facility points</li>
                <li>Plugins: QuickMapServices, Georeferencer, MMQGIS</li>
              </ul>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <a href="https://qgis.org/en/site/forusers/download.html" target="_blank" rel="noreferrer">Download QGIS</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://docs.qgis.org/" target="_blank" rel="noreferrer">Docs</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PostGIS */}
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <CardTitle>PostGIS</CardTitle>
              <CardDescription>Spatial extension for PostgreSQL: store, query, and analyze geospatial data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Spatial SQL for buffers, intersections, distances</li>
                <li>Indexes (GIST/SP-GIST) for fast spatial queries</li>
                <li>Support for vector and raster operations</li>
                <li>Great for backend analytics and tiling pipelines</li>
              </ul>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <a href="https://postgis.net/documentation/" target="_blank" rel="noreferrer">PostGIS Docs</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://www.postgresql.org/download/" target="_blank" rel="noreferrer">PostgreSQL Download</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Formats & Converters */}
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <CardTitle>Data Formats & Conversion</CardTitle>
              <CardDescription>Common formats and tools to convert between them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Vector: Shapefile, GeoJSON, KML, GPKG</li>
                <li>Tabular: CSV (with lat/long), Excel</li>
                <li>Raster: GeoTIFF, Cloud-Optimized GeoTIFF</li>
                <li>Converter: GDAL/OGR (ogr2ogr) for reprojection and format changes</li>
              </ul>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <a href="https://gdal.org/" target="_blank" rel="noreferrer">GDAL/OGR</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://mapshaper.org/" target="_blank" rel="noreferrer">Mapshaper (Web)</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Field Collection & Sync */}
          <Card className="hover:shadow-card transition-all">
            <CardHeader>
              <CardTitle>Field Collection & Sync</CardTitle>
              <CardDescription>KoboToolbox, ODK, and mobile-to-desktop workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>KoboToolbox (web), ODK Collect (Android)</li>
                <li>Export to GeoJSON/CSV for QGIS/ArcGIS</li>
                <li>QField/Mergin Maps for QGIS mobile sync</li>
              </ul>
              <div className="flex gap-3 pt-2">
                <Button asChild>
                  <a href="https://kf.kobotoolbox.org/" target="_blank" rel="noreferrer">KoboToolbox</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://play.google.com/store/apps/details?id=org.odk.collect.android" target="_blank" rel="noreferrer">ODK Collect</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="https://qfield.org/" target="_blank" rel="noreferrer">QField</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Visualization */}
        <div className="mt-10">
          <h2 className="text-2xl font-inter font-bold mb-3">Demo Visualization</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Explore demo data for Anambra’s 21 LGAs. Choose a disease metric and optionally show PHC locations.
          </p>
          <LgaMapLeaflet />
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
