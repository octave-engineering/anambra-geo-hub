import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Download } from "lucide-react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ANAMBRA_LGAS_DEMO, PHC_DEMO, type Disease } from "@/data/anambra_demo";

const diseases: Disease[] = ["malaria", "hiv", "tb"];

function toCSV() {
  const header = ["lga", "malaria", "hiv", "tb", "lat", "lon"]; 
  const rows = ANAMBRA_LGAS_DEMO.map((d) => [d.name, d.metrics.malaria, d.metrics.hiv, d.metrics.tb, d.lat, d.lon]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "anambra_demo.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function toGeoJSON() {
  const fc = {
    type: "FeatureCollection",
    features: ANAMBRA_LGAS_DEMO.map((d) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [d.lon, d.lat] },
      properties: { name: d.name, ...d.metrics },
    })),
  } as const;
  const blob = new Blob([JSON.stringify(fc)], { type: "application/geo+json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "anambra_demo.geojson";
  a.click();
  URL.revokeObjectURL(url);
}

const ramps = {
  amber: ["#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
  blue:  ["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8"],
  red:   ["#fecaca", "#fca5a5", "#f87171", "#ef4444", "#b91c1c"],
} as const;

type Ramp = keyof typeof ramps;

const colorScaleFactory = (ramp: Ramp) => (val: number) => {
  const [c1,c2,c3,c4,c5] = ramps[ramp];
  if (val >= 55) return c5;
  if (val >= 45) return c4;
  if (val >= 35) return c3;
  if (val >= 25) return c2;
  return c1;
};

const LgaMapLeaflet = () => {
  const [disease, setDisease] = useState<Disease>("malaria");
  const [showPhc, setShowPhc] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [threshold, setThreshold] = useState<number>(0);
  const [ramp, setRamp] = useState<Ramp>('amber');

  const maxVal = useMemo(() => Math.max(...ANAMBRA_LGAS_DEMO.map((d) => d.metrics[disease])), [disease]);
  const sizeMultiplier = size === "sm" ? 0.8 : size === "lg" ? 1.4 : 1;
  const colorScale = useMemo(() => colorScaleFactory(ramp), [ramp]);
  const filtered = useMemo(() => ANAMBRA_LGAS_DEMO.filter((l) => l.metrics[disease] >= threshold), [threshold, disease]);

  // Nigeria center approx and zoom for whole-country view
  const center: [number, number] = [9.0820, 8.6753]; // Leaflet expects [lat, lon]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-lg">Demo Visualization: Anambra 21 LGAs</CardTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={disease} onValueChange={(v) => setDisease(v as Disease)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select disease" />
            </SelectTrigger>
            <SelectContent>
              {diseases.map((d) => (
                <SelectItem key={d} value={d}>
                  {d.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ramp} onValueChange={(v) => setRamp(v as Ramp)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ramp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amber">Amber</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={(v) => setSize(v as any)}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
          <Toggle pressed={showPhc} onPressedChange={setShowPhc} aria-label="Toggle PHCs">
            Show PHC
          </Toggle>
          <Toggle pressed={showLabels} onPressedChange={setShowLabels} aria-label="Toggle Labels">
            Labels
          </Toggle>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Min:</span>
            <input
              type="range"
              min={0}
              max={maxVal}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <span className="w-8 text-right">{threshold}</span>
          </div>
          <Button size="sm" onClick={toCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" /> CSV
          </Button>
          <Button size="sm" onClick={toGeoJSON} variant="outline">
            <Download className="h-4 w-4 mr-2" /> GeoJSON
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[480px] rounded-md border overflow-hidden">
          <MapContainer center={center} zoom={6} minZoom={3} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* LGA centroids as proportional circle markers */}
            <LayerGroup>
              {filtered.map((lga) => {
                const val = lga.metrics[disease];
                const r = (4 + (val / maxVal) * 10) * sizeMultiplier; // pixels
                return (
                  <CircleMarker
                    key={lga.name}
                    center={[lga.lat, lga.lon]}
                    radius={r}
                    pathOptions={{ color: "#1f2937", weight: 0.5, fillColor: colorScale(val), fillOpacity: 0.85 }}
                  >
                    {showLabels && (
                      <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
                        <span style={{ fontFamily: "Inter", fontSize: 12 }}>{lga.name}</span>
                      </Tooltip>
                    )}
                  </CircleMarker>
                );
              })}
            </LayerGroup>

            {/* Optional PHC points */}
            {showPhc && (
              <LayerGroup>
                {PHC_DEMO.map((p) => (
                  <CircleMarker
                    key={p.name}
                    center={[p.lat, p.lon]}
                    radius={4}
                    pathOptions={{ color: "#1f2937", weight: 0.5, fillColor: "#2563eb", fillOpacity: 1 }}
                  >
                    <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                      <span>{`${p.name} (${p.lga})`}</span>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </LayerGroup>
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LgaMapLeaflet;
