import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TrainingPage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">GIS Training Modules</h1>
          <p className="text-muted-foreground">
            Practical geospatial skills tailored for public health and planning in Anambra State.
          </p>
        </div>

        <div className="space-y-6">
          {/* Module 1a */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Module 1a - Fundamentals of GIS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Learn the building blocks of GIS, including key concepts, data types, coordinate systems, and common formats, with hands-on practice using QGIS and ArcGIS.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Definition, components and applications of GIS</li>
                <li>Spatial vs. non-spatial data; vector and raster data</li>
                <li>Attribute tables, metadata, coordinate systems, projections</li>
                <li>Overview of QGIS and ArcGIS</li>
                <li>Common GIS data formats (Shapefile, CSV, GeoJSON, KML)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 1b */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Module 1b - Basic Data Collection & Mapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Gain practical skills in georeferencing health data, collecting data in the field with mobile tools, importing it into GIS software, and creating simple maps.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Mobile data collection (KoboToolbox, ODK)</li>
                <li>Geo-referencing health facility and patient data</li>
                <li>Importing data into QGIS/ArcGIS</li>
                <li>Creating basic point, line, and polygon maps</li>
              </ul>
            </CardContent>
          </Card>

          {/* Module 1c */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Module 1c - Geospatial Technologies in Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Discover how GIS, GPS, and remote sensing are used in health programs for surveillance, logistics, and planning, using real-world examples.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>GIS, GPS, Remote Sensing basics</li>
                <li>Applications in health surveillance, program planning, logistics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
