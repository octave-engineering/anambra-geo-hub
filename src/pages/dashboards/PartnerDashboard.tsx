import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Database,
  Download,
  BarChart3,
  Shield,
  Globe,
  Briefcase,
  Clock,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PartnerDashboard = () => {
  const navigate = useNavigate();

  // Mock data for partner access
  const partnerMetrics = [
    {
      title: "Available Datasets",
      value: "18",
      icon: Database,
      change: "+2",
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: "7",
      icon: Briefcase,
      change: "+1",
      color: "text-green-600",
    },
    {
      title: "Data Downloads",
      value: "89",
      icon: Download,
      change: "+15",
      color: "text-purple-600",
    },
    {
      title: "Reporting Period",
      value: "Q4 2024",
      icon: Clock,
      change: "Current",
      color: "text-amber-600",
    },
  ];

  const programmeTrends = [
    { month: "Jul", malaria: 580, hiv: 94, tb: 45, maternal: 156 },
    { month: "Aug", malaria: 620, hiv: 96, tb: 42, maternal: 168 },
    { month: "Sep", malaria: 550, hiv: 89, tb: 36, maternal: 145 },
    { month: "Oct", malaria: 490, hiv: 93, tb: 40, maternal: 159 },
    { month: "Nov", malaria: 430, hiv: 90, tb: 35, maternal: 142 },
    { month: "Dec", malaria: 380, hiv: 88, tb: 32, maternal: 138 },
  ];

  const fundingProgress = [
    {
      program: "Malaria Control",
      allocated: 2500000,
      utilized: 1800000,
      percentage: 72,
    },
    {
      program: "HIV/AIDS Support",
      allocated: 1800000,
      utilized: 1550000,
      percentage: 86,
    },
    {
      program: "TB Treatment",
      allocated: 1200000,
      utilized: 980000,
      percentage: 82,
    },
    {
      program: "Maternal Health",
      allocated: 2000000,
      utilized: 1200000,
      percentage: 60,
    },
    {
      program: "Child Immunization",
      allocated: 1500000,
      utilized: 1350000,
      percentage: 90,
    },
  ];

  const restrictedDatasets = [
    {
      name: "HIV Unit Detailed Data",
      category: "Disease Surveillance",
      sensitivity: "High",
      lastUpdate: "2024-01-17",
    },
    {
      name: "TB Treatment Outcomes",
      category: "Clinical Data",
      sensitivity: "High",
      lastUpdate: "2024-01-16",
    },
    {
      name: "Disease Surveillance Weekly",
      category: "Epidemiology",
      sensitivity: "Medium",
      lastUpdate: "2024-01-22",
    },
    {
      name: "Lab Results Aggregated",
      category: "Laboratory",
      sensitivity: "Medium",
      lastUpdate: "2024-01-21",
    },
    {
      name: "Referral System Data",
      category: "Health System",
      sensitivity: "Medium",
      lastUpdate: "2024-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header with Logout */}
      <div className="flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Partner Dashboard</h1>
        <Button
          variant="destructive"
          onClick={() => navigate("/logout")}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-inter font-bold text-foreground mb-2">
              Partner Dashboard
            </h1>
            <p className="text-muted-foreground">
              PHCs, NGOs, Development Partners & Technical Assistance Providers
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Users className="h-4 w-4 mr-2" />
            Partner Access
          </Badge>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">
                  Enhanced Access Granted
                </h3>
                <p className="text-blue-700">
                  You have access to program data, funding information, and
                  restricted health datasets for your development programs and
                  technical assistance activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* === Keep all your normal content below (metrics, charts, restricted datasets, quick actions, resources) === */}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {partnerMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-card transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {metric.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Program Trends + Funding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Program Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Program Performance Trends</span>
              </CardTitle>
              <CardDescription>
                Health program indicators over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={programmeTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="malaria"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Malaria Program"
                    />
                    <Line
                      type="monotone"
                      dataKey="hiv"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="HIV Program"
                    />
                    <Line
                      type="monotone"
                      dataKey="tb"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="TB Program"
                    />
                    <Line
                      type="monotone"
                      dataKey="maternal"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Maternal Health"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Funding Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Program Funding Status</span>
              </CardTitle>
              <CardDescription>
                Budget allocation and utilization by program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundingProgress.map((program, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{program.program}</span>
                      <span className="text-muted-foreground">
                        ${(program.utilized / 1000000).toFixed(1)}M / $
                        {(program.allocated / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${program.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {program.percentage}% utilized
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restricted Datasets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Restricted Dataset Access</span>
            </CardTitle>
            <CardDescription>
              Enhanced datasets available to development partners for program
              monitoring and evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restrictedDatasets.map((dataset, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dataset.category}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        dataset.sensitivity === "High"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {dataset.sensitivity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Last updated: {dataset.lastUpdate}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-card transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Database className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Program Data Export</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Export comprehensive program data for reporting and analysis
              </p>
              <Button className="w-full">Export Data</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-200">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Custom Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate custom reports and visualizations for your programs
              </p>
              <Button variant="outline" className="w-full">
                Create Report
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Collaboration Hub</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other partners and government stakeholders
              </p>
              <Button variant="outline" className="w-full">
                Join Hub
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Partner Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Partner Resources</span>
            </CardTitle>
            <CardDescription>
              Tools and resources specifically designed for development partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">API Documentation</div>
                  <div className="text-sm text-muted-foreground">
                    Technical integration guides
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Data Dictionary</div>
                  <div className="text-sm text-muted-foreground">
                    Variable definitions & metadata
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Training Materials</div>
                  <div className="text-sm text-muted-foreground">
                    Data analysis tutorials
                  </div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="text-left">
                  <div className="font-medium">Support Portal</div>
                  <div className="text-sm text-muted-foreground">
                    Technical assistance
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerDashboard;
