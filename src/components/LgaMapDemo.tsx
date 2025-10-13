import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Download } from "lucide-react";
import { ComposableMap, ZoomableGroup, Marker } from "react-simple-maps";
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
  };
  const blob = new Blob([JSON.stringify(fc)], { type: "application/geo+json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "anambra_demo.geojson";
  a.click();
  URL.revokeObjectURL(url);
}

type Ramp = 'amber' | 'blue' | 'red';

const ramps: Record<Ramp, string[]> = {
  amber: ["#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
  blue:  ["#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8"],
  red:   ["#fecaca", "#fca5a5", "#f87171", "#ef4444", "#b91c1c"],
};

const colorScaleFactory = (ramp: Ramp) => (val: number) => {
  const [c1,c2,c3,c4,c5] = ramps[ramp];
  if (val >= 55) return c5;
  if (val >= 45) return c4;
  if (val >= 35) return c3;
  if (val >= 25) return c2;
  return c1;
};

const LgaMapDemo = () => {
  const [disease, setDisease] = useState<Disease>("malaria");
  const [showPhc, setShowPhc] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [threshold, setThreshold] = useState<number>(0);
  const [ramp, setRamp] = useState<Ramp>('amber');

  const maxVal = useMemo(() => Math.max(...ANAMBRA_LGAS_DEMO.map((d) => d.metrics[disease])), [disease]);

  // Compute map center from points to ensure Anambra sits in view
  const center = useMemo(() => {
    const avgLon = ANAMBRA_LGAS_DEMO.reduce((s, d) => s + d.lon, 0) / ANAMBRA_LGAS_DEMO.length;
    const avgLat = ANAMBRA_LGAS_DEMO.reduce((s, d) => s + d.lat, 0) / ANAMBRA_LGAS_DEMO.length;
    return [avgLon, avgLat] as [number, number];
  }, []);

  const sizeMultiplier = size === "sm" ? 0.8 : size === "lg" ? 1.4 : 1;
  const colorScale = useMemo(() => colorScaleFactory(ramp), [ramp]);

  const filtered = useMemo(() => ANAMBRA_LGAS_DEMO.filter((l) => l.metrics[disease] >= threshold), [threshold, disease]);

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
          {/* Color ramp */}
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
          {/* Size control */}
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
          {/* Threshold filter */}
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const fc = {
                type: 'FeatureCollection',
                features: filtered.map((d) => ({
                  type: 'Feature',
                  geometry: { type: 'Point', coordinates: [d.lon, d.lat] },
                  properties: { name: d.name, ...d.metrics },
                })),
              };
              const payload = encodeURIComponent(JSON.stringify(fc));
              window.open(`https://geojson.io/#data=data:application/json,${payload}`, '_blank');
            }}
          >
            Open in geojson.io
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[480px] rounded-md border bg-muted/30">
          <ComposableMap projection="geoMercator" style={{ width: "100%", height: "100%" }}>
            {/* Focus on Anambra area: center ~ (7.0E, 6.2N), higher zoom */}
            <ZoomableGroup center={center} zoom={12} minZoom={9} maxZoom={16}>
              {/* LGA centroids as proportional circles */}
              {filtered.map((lga) => {
                const val = lga.metrics[disease];
                const r = (4 + (val / maxVal) * 10) * sizeMultiplier; // radius scaled by value and size
                return (
                  <Marker key={lga.name} coordinates={[lga.lon, lga.lat]}>
                    <circle r={r} fill={colorScale(val)} stroke="#1f2937" strokeWidth={0.5} fillOpacity={0.85} />
                    {showLabels && (
                      <text textAnchor="middle" y={-r - 4} style={{ fontFamily: "Inter", fontSize: 10 }}>
                        {lga.name}
                      </text>
                    )}
                  </Marker>
                );
              })}

              {/* Optional PHC points */}
              {showPhc &&
                PHC_DEMO.map((p) => (
                  <Marker key={p.name} coordinates={[p.lon, p.lat]}>
                    <circle r={3} fill="#2563eb" stroke="#1f2937" strokeWidth={0.5} />
                    <title>{`${p.name} (${p.lga})`}</title>
                  </Marker>
                ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: ramps[ramp][0] }} />
            Low
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: ramps[ramp][2] }} />
            Medium
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full" style={{ background: ramps[ramp][4] }} />
            High
          </div>
        </div>

        {/* Attribute table */}
        <div className="mt-4 overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2">LGA</th>
                <th className="text-left px-3 py-2">{disease.toUpperCase()}</th>
                <th className="text-left px-3 py-2">Lat</th>
                <th className="text-left px-3 py-2">Lon</th>
              </tr>
            </thead>
            <tbody>
              {filtered
                .slice()
                .sort((a, b) => b.metrics[disease] - a.metrics[disease])
                .map((row) => (
                  <tr key={row.name} className="border-t">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.metrics[disease]}</td>
                    <td className="px-3 py-2">{row.lat.toFixed(3)}</td>
                    <td className="px-3 py-2">{row.lon.toFixed(3)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LgaMapDemo;
