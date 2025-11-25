import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Download,
  AlertTriangle,
  Users,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import GeoJSON from "ol/format/GeoJSON";

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MetricConfig {
  id: string;
  name: string;
  description: string;
}

interface LGATrendData {
  lga: string;
  totalCases: number;
  facilities: number;
  population: number | null;
  incidence: number | null;
}

interface OutlierFacility {
  facilityId: string;
  facilityName: string;
  lga: string;
  cases: number;
  zScore: number;
  outlierType: 'high' | 'low';
}

const AnalyticsPage: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE || 'https://api.anamgeohub.octaveanalytics.com/api';
  const authenticatedFetch = useAuthenticatedFetch();

  // State
  const [selectedMetric, setSelectedMetric] = useState<string>('severe_malaria');
  const [loading, setLoading] = useState(false);
  const [chartMode, setChartMode] = useState<'trends' | 'seasonality'>('trends');
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  
  // Data state
  const [allFeatures, setAllFeatures] = useState<any[]>([]);
  const [yearSeries, setYearSeries] = useState<any[]>([]);
  const [lgaYearSeries, setLgaYearSeries] = useState<Map<string, any[]>>(new Map());
  const [seasonalitySeries, setSeasonalitySeries] = useState<any[]>([]);
  const [lgaRankings, setLgaRankings] = useState<LGATrendData[]>([]);
  const [outlierFacilities, setOutlierFacilities] = useState<OutlierFacility[]>([]);
  const [underservedLGAs, setUnderservedLGAs] = useState<any[]>([]);
  const [priorityLGAs, setPriorityLGAs] = useState<any[]>([]);

  // Available metrics
  const metrics: MetricConfig[] = [
    { id: 'severe_malaria', name: 'Severe Malaria Cases', description: 'Cases of severe malaria' },
    { id: 'sickle_cell', name: 'Sickle Cell Cases', description: 'Sickle cell disease cases' },
    { id: 'breast_cancer', name: 'Breast Cancer Cases', description: 'Breast cancer cases' },
    { id: 'death_cases', name: 'Death Cases', description: 'Death cases' },
    { id: 'deliveries_sba', name: 'Deliveries with SBA', description: 'Deliveries with skilled birth attendant' },
    { id: 'measles_under_5', name: 'Measles Cases (Under 5)', description: 'Measles cases in children under 5' },
  ];

  const currentMetric = metrics.find(m => m.id === selectedMetric) || metrics[0];

  // Load data when metric changes
  useEffect(() => {
    loadMetricData();
  }, [selectedMetric]);

  const loadMetricData = async () => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/health-metrics/${selectedMetric}`);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);
      
      const geojson = await response.json();
      const features = new GeoJSON().readFeatures(geojson, {
        featureProjection: 'EPSG:3857'
      });
      
      setAllFeatures(features);
      computeAnalytics(features);
    } catch (error) {
      console.error('Error loading metric data:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeAnalytics = (features: any[]) => {
    // 1. Compute yearly state trends
    const yearTotals = new Map<number, number>();
    const yearSet = new Set<number>();
    
    for (const f of features) {
      const periodRaw = f.get('period');
      if (!periodRaw) continue;
      const periodStr = String(periodRaw);
      if (periodStr.length < 4) continue;
      const year = Number(periodStr.slice(0, 4));
      if (isNaN(year)) continue;
      const cases = Number(f.get('case_count') || 0);
      yearSet.add(year);
      yearTotals.set(year, (yearTotals.get(year) || 0) + cases);
    }
    
    const years = Array.from(yearSet).sort();
    setYearSeries(years.map(year => ({
      year,
      label: String(year),
      stateCases: yearTotals.get(year) || 0,
    })));

    // 2. Compute LGA-level year trends
    const lgaYearMap = new Map<string, Map<number, number>>();
    for (const f of features) {
      const lga = f.get('lga_name');
      const periodRaw = f.get('period');
      if (!lga || !periodRaw) continue;
      const periodStr = String(periodRaw);
      if (periodStr.length < 4) continue;
      const year = Number(periodStr.slice(0, 4));
      if (isNaN(year)) continue;
      const cases = Number(f.get('case_count') || 0);
      if (!lgaYearMap.has(lga)) lgaYearMap.set(lga, new Map());
      const yearMap = lgaYearMap.get(lga)!;
      yearMap.set(year, (yearMap.get(year) || 0) + cases);
    }

    const lgaSeriesMap = new Map<string, any[]>();
    for (const [lga, yearMap] of lgaYearMap.entries()) {
      lgaSeriesMap.set(lga, years.map(year => ({
        year,
        label: String(year),
        cases: yearMap.get(year) || 0,
      })));
    }
    setLgaYearSeries(lgaSeriesMap);

    // 3. Compute seasonality (average by month across all years)
    const monthTotals = new Map<number, number>();
    const monthCounts = new Map<number, number>();
    for (const f of features) {
      const periodRaw = f.get('period');
      if (!periodRaw) continue;
      const periodStr = String(periodRaw);
      if (periodStr.length < 6) continue;
      const month = Number(periodStr.slice(4, 6));
      if (isNaN(month) || month < 1 || month > 12) continue;
      const cases = Number(f.get('case_count') || 0);
      monthTotals.set(month, (monthTotals.get(month) || 0) + cases);
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
    }

    const seasonality = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const total = monthTotals.get(month) || 0;
      const count = monthCounts.get(month) || 1;
      return {
        month,
        label: MONTH_LABELS[i],
        avgCases: count > 0 ? total / count : 0,
      };
    });
    setSeasonalitySeries(seasonality);

    // 4. Compute LGA rankings
    const lgaMap = new Map<string, { totalCases: number; facilities: Set<string>; population: number | null }>();
    for (const f of features) {
      const lga = f.get('lga_name');
      if (!lga) continue;
      const cases = Number(f.get('case_count') || 0);
      const facilityId = f.get('facility_id') || f.get('facility_name') || '';
      const pop = f.get('population');
      const popVal = pop !== undefined && pop !== null ? Number(pop) : null;
      
      if (!lgaMap.has(lga)) {
        lgaMap.set(lga, { totalCases: 0, facilities: new Set(), population: popVal });
      }
      const lgaData = lgaMap.get(lga)!;
      lgaData.totalCases += cases;
      if (facilityId) lgaData.facilities.add(String(facilityId));
      if (popVal && !lgaData.population) lgaData.population = popVal;
    }

    const rankings: LGATrendData[] = Array.from(lgaMap.entries()).map(([lga, data]) => {
      const incidence = data.population && data.population > 0
        ? (data.totalCases / data.population) * 1000
        : null;
      return {
        lga,
        totalCases: data.totalCases,
        facilities: data.facilities.size,
        population: data.population,
        incidence,
      };
    }).sort((a, b) => b.totalCases - a.totalCases);
    
    setLgaRankings(rankings);

    // 5. Compute outlier facilities using z-scores within each LGA
    const lgaFacilityMap = new Map<string, Map<string, { name: string; cases: number }>>();
    
    // Aggregate facility cases per LGA
    for (const f of features) {
      const lga = f.get('lga_name');
      const facilityId = f.get('facility_id') || f.get('facility_name') || '';
      const facilityName = f.get('facility_name') || 'Unknown Facility';
      const cases = Number(f.get('case_count') || 0);
      
      if (!lga || !facilityId) continue;
      
      if (!lgaFacilityMap.has(lga)) {
        lgaFacilityMap.set(lga, new Map());
      }
      const facilityMap = lgaFacilityMap.get(lga)!;
      if (!facilityMap.has(facilityId)) {
        facilityMap.set(facilityId, { name: facilityName, cases: 0 });
      }
      facilityMap.get(facilityId)!.cases += cases;
    }

    // Compute z-scores per LGA and identify outliers
    const allOutliers: OutlierFacility[] = [];
    const Z_SCORE_THRESHOLD = 2.0;

    for (const [lga, facilityMap] of lgaFacilityMap.entries()) {
      const facilityCases = Array.from(facilityMap.values()).map(f => f.cases);
      
      // Need at least 3 facilities to compute meaningful statistics
      if (facilityCases.length < 3) continue;
      
      // Compute mean and standard deviation
      const mean = facilityCases.reduce((sum, val) => sum + val, 0) / facilityCases.length;
      const variance = facilityCases.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / facilityCases.length;
      const stdDev = Math.sqrt(variance);
      
      // Skip if no variation (all facilities have same cases)
      if (stdDev === 0) continue;
      
      // Calculate z-scores and flag outliers
      for (const [facilityId, facilityData] of facilityMap.entries()) {
        const zScore = (facilityData.cases - mean) / stdDev;
        
        if (Math.abs(zScore) >= Z_SCORE_THRESHOLD) {
          allOutliers.push({
            facilityId,
            facilityName: facilityData.name,
            lga,
            cases: facilityData.cases,
            zScore,
            outlierType: zScore > 0 ? 'high' : 'low',
          });
        }
      }
    }

    // Sort by absolute z-score (most extreme outliers first)
    allOutliers.sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore));
    setOutlierFacilities(allOutliers);

    // 6. Compute underserved LGAs (facilities per population)
    const underserved = rankings
      .filter(lga => lga.population && lga.population > 0)
      .map(lga => {
        const facilitiesPer10k = (lga.facilities / lga.population!) * 10000;
        const underservedScore = lga.incidence !== null && facilitiesPer10k > 0
          ? lga.incidence / facilitiesPer10k
          : 0;
        return {
          lga: lga.lga,
          population: lga.population!,
          facilities: lga.facilities,
          facilitiesPer10k,
          totalCases: lga.totalCases,
          incidence: lga.incidence,
          underservedScore,
        };
      })
      .sort((a, b) => b.underservedScore - a.underservedScore);
    
    setUnderservedLGAs(underserved);

    // 7. Compute priority LGAs (combined score: burden + underserved + incidence)
    const priorities = rankings
      .filter(lga => lga.population && lga.population > 0 && lga.incidence !== null)
      .map(lga => {
        const facilitiesPer10k = (lga.facilities / lga.population!) * 10000;
        const underservedScore = lga.incidence! / (facilitiesPer10k + 0.01);
        
        // Normalize scores to 0-100 scale
        const maxCases = Math.max(...rankings.map(r => r.totalCases));
        const maxIncidence = Math.max(...rankings.filter(r => r.incidence !== null).map(r => r.incidence!));
        const maxUnderserved = Math.max(...underserved.map(u => u.underservedScore));
        
        const burdenScore = (lga.totalCases / maxCases) * 100;
        const incidenceScore = (lga.incidence! / maxIncidence) * 100;
        const underservedScoreNorm = (underservedScore / maxUnderserved) * 100;
        
        // Weighted average: burden 40%, incidence 30%, underserved 30%
        const priorityScore = (burdenScore * 0.4) + (incidenceScore * 0.3) + (underservedScoreNorm * 0.3);
        
        return {
          lga: lga.lga,
          totalCases: lga.totalCases,
          incidence: lga.incidence,
          facilities: lga.facilities,
          population: lga.population,
          facilitiesPer10k,
          priorityScore,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);
    
    setPriorityLGAs(priorities);
  };

  const totalCases = lgaRankings.reduce((sum, lga) => sum + lga.totalCases, 0);
  const totalFacilities = lgaRankings.reduce((sum, lga) => sum + lga.facilities, 0);
  const totalLGAs = lgaRankings.length;

  const keyMetrics = [
    {
      title: "Total Cases (All Time)",
      value: totalCases.toLocaleString(),
      icon: Activity,
      color: "text-red-600",
    },
    {
      title: "Health Facilities",
      value: totalFacilities.toLocaleString(),
      icon: MapPin,
      color: "text-blue-600",
    },
    {
      title: "LGAs Covered",
      value: totalLGAs.toString(),
      icon: BarChart3,
      color: "text-green-600",
    },
    {
      title: "Outlier Facilities",
      value: outlierFacilities.length.toString(),
      icon: AlertTriangle,
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-inter font-bold mb-2">
              Health Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time insights into health indicators across Anambra State
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {metrics.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {keyMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <Card key={i}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        )}

        {!loading && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{chartMode === 'trends' ? 'Trends Over Time' : 'Seasonality Pattern'}</CardTitle>
                      <CardDescription>
                        {chartMode === 'trends' 
                          ? `${currentMetric.name} yearly trends` 
                          : `Average ${currentMetric.name} by month`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant={chartMode === 'trends' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setChartMode('trends')}
                      >
                        Trends
                      </Button>
                      <Button 
                        variant={chartMode === 'seasonality' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setChartMode('seasonality')}
                      >
                        Seasonality
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartMode === 'trends' ? (
                        <LineChart data={yearSeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="stateCases" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            name="State Total"
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={seasonalitySeries}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="avgCases" fill="#f59e0b" name="Avg Cases" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top 10 LGAs by Total Cases</CardTitle>
                  <CardDescription>Disease burden across Local Government Areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={lgaRankings.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="lga" 
                          interval={0} 
                          angle={-45} 
                          textAnchor="end" 
                          height={120} 
                          tick={{ fontSize: 10 }} 
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="totalCases" fill="#f59e0b" name="Total Cases" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LGA Rankings Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>LGA Burden Summary</CardTitle>
                <CardDescription>
                  Complete ranking of all LGAs by {currentMetric.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Rank</th>
                        <th className="text-left p-2 font-semibold">LGA</th>
                        <th className="text-right p-2 font-semibold">Total Cases</th>
                        <th className="text-right p-2 font-semibold">Facilities</th>
                        <th className="text-right p-2 font-semibold">Population</th>
                        <th className="text-right p-2 font-semibold">Incidence (per 1,000)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lgaRankings.map((lga, idx) => (
                        <tr key={lga.lga} className="border-b hover:bg-gray-50">
                          <td className="p-2">{idx + 1}</td>
                          <td className="p-2 font-medium">{lga.lga}</td>
                          <td className="p-2 text-right">{lga.totalCases.toLocaleString()}</td>
                          <td className="p-2 text-right">{lga.facilities}</td>
                          <td className="p-2 text-right">
                            {lga.population ? lga.population.toLocaleString() : 'N/A'}
                          </td>
                          <td className="p-2 text-right">
                            {lga.incidence !== null ? lga.incidence.toFixed(2) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Outlier Facilities */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Outlier Facilities</CardTitle>
                <CardDescription>
                  Facilities with unusually high or low case counts compared to peers in the same LGA (z-score ≥ 2.0)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {outlierFacilities.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No significant outliers detected for this metric.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {/* High Outliers */}
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-red-600">
                        High Outliers ({outlierFacilities.filter(f => f.outlierType === 'high').length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 font-semibold text-sm">Facility</th>
                              <th className="text-left p-2 font-semibold text-sm">LGA</th>
                              <th className="text-right p-2 font-semibold text-sm">Total Cases</th>
                              <th className="text-right p-2 font-semibold text-sm">Z-Score</th>
                              <th className="text-left p-2 font-semibold text-sm">Interpretation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {outlierFacilities
                              .filter(f => f.outlierType === 'high')
                              .slice(0, 10)
                              .map((facility, idx) => (
                                <tr key={idx} className="border-b hover:bg-red-50">
                                  <td className="p-2 text-sm">{facility.facilityName}</td>
                                  <td className="p-2 text-sm">{facility.lga}</td>
                                  <td className="p-2 text-right text-sm font-medium">{facility.cases.toLocaleString()}</td>
                                  <td className="p-2 text-right text-sm font-mono">{facility.zScore.toFixed(2)}</td>
                                  <td className="p-2 text-sm text-red-600">
                                    {facility.zScore >= 3 
                                      ? 'Very high - investigate' 
                                      : 'High - monitor closely'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Low Outliers */}
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-blue-600">
                        Low Outliers ({outlierFacilities.filter(f => f.outlierType === 'low').length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 font-semibold text-sm">Facility</th>
                              <th className="text-left p-2 font-semibold text-sm">LGA</th>
                              <th className="text-right p-2 font-semibold text-sm">Total Cases</th>
                              <th className="text-right p-2 font-semibold text-sm">Z-Score</th>
                              <th className="text-left p-2 font-semibold text-sm">Interpretation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {outlierFacilities
                              .filter(f => f.outlierType === 'low')
                              .slice(0, 10)
                              .map((facility, idx) => (
                                <tr key={idx} className="border-b hover:bg-blue-50">
                                  <td className="p-2 text-sm">{facility.facilityName}</td>
                                  <td className="p-2 text-sm">{facility.lga}</td>
                                  <td className="p-2 text-right text-sm font-medium">{facility.cases.toLocaleString()}</td>
                                  <td className="p-2 text-right text-sm font-mono">{facility.zScore.toFixed(2)}</td>
                                  <td className="p-2 text-sm text-blue-600">
                                    {facility.zScore <= -3 
                                      ? 'Very low - possible under-reporting' 
                                      : 'Low - verify data quality'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Underserved Areas */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Underserved Areas</CardTitle>
                <CardDescription>
                  LGAs ranked by underserved score (incidence / facilities per 10k population)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {underservedLGAs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Population data not available for underserved analysis.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold text-sm">Rank</th>
                          <th className="text-left p-2 font-semibold text-sm">LGA</th>
                          <th className="text-right p-2 font-semibold text-sm">Population</th>
                          <th className="text-right p-2 font-semibold text-sm">Facilities</th>
                          <th className="text-right p-2 font-semibold text-sm">Facilities per 10k</th>
                          <th className="text-right p-2 font-semibold text-sm">Incidence (per 1,000)</th>
                          <th className="text-right p-2 font-semibold text-sm">Underserved Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {underservedLGAs.slice(0, 15).map((lga, idx) => (
                          <tr 
                            key={lga.lga} 
                            className={`border-b hover:bg-gray-50 ${idx < 5 ? 'bg-amber-50' : ''}`}
                          >
                            <td className="p-2 text-sm">{idx + 1}</td>
                            <td className="p-2 text-sm font-medium">{lga.lga}</td>
                            <td className="p-2 text-right text-sm">{lga.population.toLocaleString()}</td>
                            <td className="p-2 text-right text-sm">{lga.facilities}</td>
                            <td className="p-2 text-right text-sm">{lga.facilitiesPer10k.toFixed(2)}</td>
                            <td className="p-2 text-right text-sm">
                              {lga.incidence !== null ? lga.incidence.toFixed(2) : 'N/A'}
                            </td>
                            <td className="p-2 text-right text-sm font-semibold text-amber-700">
                              {lga.underservedScore.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-muted-foreground mt-3">
                      Top 5 highlighted. High score = high burden but low facility coverage.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority Ranking */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Priority Ranking for Action</CardTitle>
                <CardDescription>
                  LGAs ranked by combined priority score (burden 40%, incidence 30%, underserved 30%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {priorityLGAs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Priority analysis requires population and incidence data.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold text-sm">Rank</th>
                          <th className="text-left p-2 font-semibold text-sm">LGA</th>
                          <th className="text-right p-2 font-semibold text-sm">Total Cases</th>
                          <th className="text-right p-2 font-semibold text-sm">Incidence</th>
                          <th className="text-right p-2 font-semibold text-sm">Facilities per 10k</th>
                          <th className="text-right p-2 font-semibold text-sm">Priority Score</th>
                          <th className="text-left p-2 font-semibold text-sm">Action Tier</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priorityLGAs.map((lga, idx) => {
                          let tier = 'Monitor';
                          let tierColor = 'text-gray-600';
                          if (idx < 3) {
                            tier = 'Tier 1 - Urgent';
                            tierColor = 'text-red-600 font-semibold';
                          } else if (idx < 7) {
                            tier = 'Tier 2 - High';
                            tierColor = 'text-orange-600 font-medium';
                          } else if (idx < 12) {
                            tier = 'Tier 3 - Medium';
                            tierColor = 'text-amber-600';
                          }
                          
                          return (
                            <tr 
                              key={lga.lga} 
                              className={`border-b hover:bg-gray-50 ${idx < 3 ? 'bg-red-50' : idx < 7 ? 'bg-orange-50' : ''}`}
                            >
                              <td className="p-2 text-sm">{idx + 1}</td>
                              <td className="p-2 text-sm font-medium">{lga.lga}</td>
                              <td className="p-2 text-right text-sm">{lga.totalCases.toLocaleString()}</td>
                              <td className="p-2 text-right text-sm">{lga.incidence!.toFixed(2)}</td>
                              <td className="p-2 text-right text-sm">{lga.facilitiesPer10k.toFixed(2)}</td>
                              <td className="p-2 text-right text-sm font-semibold">{lga.priorityScore.toFixed(1)}</td>
                              <td className={`p-2 text-sm ${tierColor}`}>{tier}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <p className="text-xs text-muted-foreground mt-3">
                      Tier 1 (top 3) = immediate action; Tier 2 (4-7) = high priority; Tier 3 (8-12) = medium priority
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
