// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Shield, Database, Users, Settings, AlertTriangle, Activity, Server, Key } from "lucide-react";
// import DatasetTable from "@/components/DatasetTable";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

// const AdminDashboard = () => {
//   const systemMetrics = [
//     { title: "Total Datasets", value: "20", icon: Database, status: "healthy", change: "+2" },
//     { title: "Active Users", value: "147", icon: Users, status: "healthy", change: "+12" },
//     { title: "System Uptime", value: "99.8%", icon: Server, status: "healthy", change: "0%" },
//     { title: "Data Quality", value: "96.4%", icon: Activity, status: "warning", change: "-1.2%" },
//   ];

//   const userActivity = [
//     { week: 'W1', public: 45, partners: 12, admin: 8 },
//     { week: 'W2', public: 52, partners: 15, admin: 6 },
//     { week: 'W3', public: 38, partners: 18, admin: 12 },
//     { week: 'W4', public: 61, partners: 14, admin: 9 },
//   ];

//   const dataQuality = [
//     { month: 'Aug', completeness: 94, accuracy: 96, timeliness: 89 },
//     { month: 'Sep', completeness: 96, accuracy: 95, timeliness: 92 },
//     { month: 'Oct', completeness: 95, accuracy: 97, timeliness: 94 },
//     { month: 'Nov', completeness: 97, accuracy: 96, timeliness: 91 },
//     { month: 'Dec', completeness: 96, accuracy: 98, timeliness: 96 },
//   ];

//   const systemAlerts = [
//     { type: 'warning', message: 'DHIS2 API connection intermittent', time: '2 hours ago' },
//     { type: 'info', message: 'Monthly data backup completed successfully', time: '1 day ago' },
//     { type: 'warning', message: 'Storage capacity at 78%', time: '2 days ago' },
//     { type: 'success', message: 'Security scan completed - no issues found', time: '3 days ago' },
//   ];

//   const pendingApprovals = [
//     { type: 'Dataset Submission', item: 'Community Health Survey 2024', user: 'NGO Partner', priority: 'Medium' },
//     { type: 'User Access Request', item: 'Enhanced Access Request', user: 'Development Partner', priority: 'High' },
//     { type: 'Data Update', item: 'TB Unit Data Q4', user: 'MoH TB Unit', priority: 'Low' },
//   ];

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2">
//                 System Administration
//               </h1>
//               <p className="text-muted-foreground">
//                 Anambra State Government - Full Administrative Access
//               </p>
//             </div>
//             <Badge className="bg-amber-100 text-amber-800 border-amber-200">
//               <Shield className="h-4 w-4 mr-2" />
//               Admin Access
//             </Badge>
//           </div>

//           {/* System Status */}
//           <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <Shield className="h-8 w-8 text-amber-600" />
//                   <div>
//                     <h3 className="font-semibold text-amber-900">System Status: Operational</h3>
//                     <p className="text-amber-700">
//                       All systems running normally. Last maintenance: Jan 15, 2024
//                     </p>
//                   </div>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   <Settings className="h-4 w-4 mr-2" />
//                   System Settings
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* System Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           {systemMetrics.map((metric, index) => {
//             const Icon = metric.icon;
//             const getStatusColor = (status: string) => {
//               switch (status) {
//                 case 'healthy': return 'text-green-600';
//                 case 'warning': return 'text-amber-600';
//                 case 'error': return 'text-red-600';
//                 default: return 'text-gray-600';
//               }
//             };

//             return (
//               <Card key={index} className="hover:shadow-card transition-all duration-200">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
//                       <p className="text-2xl font-bold text-foreground">{metric.value}</p>
//                       <p className={`text-sm mt-1 ${getStatusColor(metric.status)}`}>
//                         {metric.change}
//                       </p>
//                     </div>
//                     <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                       <Icon className="h-6 w-6 text-primary" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* User Activity */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Users className="h-5 w-5 text-primary" />
//                 <span>User Activity Trends</span>
//               </CardTitle>
//               <CardDescription>
//                 Weekly active users by access level
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={userActivity}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="week" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="public" fill="#10b981" name="Public Users" />
//                     <Bar dataKey="partners" fill="#3b82f6" name="Partners" />
//                     <Bar dataKey="admin" fill="#f59e0b" name="Administrators" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Data Quality Metrics */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Activity className="h-5 w-5 text-primary" />
//                 <span>Data Quality Metrics</span>
//               </CardTitle>
//               <CardDescription>
//                 Monthly data quality indicators
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={dataQuality}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis domain={[80, 100]} />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="completeness" stroke="#10b981" strokeWidth={2} name="Completeness %" />
//                     <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
//                     <Line type="monotone" dataKey="timeliness" stroke="#f59e0b" strokeWidth={2} name="Timeliness %" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* System Alerts & Pending Approvals */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* System Alerts */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <AlertTriangle className="h-5 w-5 text-primary" />
//                 <span>System Alerts</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {systemAlerts.map((alert, index) => {
//                   const getAlertColor = (type: string) => {
//                     switch (type) {
//                       case 'warning': return 'border-l-amber-500 bg-amber-50';
//                       case 'error': return 'border-l-red-500 bg-red-50';
//                       case 'success': return 'border-l-green-500 bg-green-50';
//                       default: return 'border-l-blue-500 bg-blue-50';
//                     }
//                   };

//                   return (
//                     <div key={index} className={`p-3 border-l-4 rounded-r-lg ${getAlertColor(alert.type)}`}>
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm font-medium">{alert.message}</p>
//                         <span className="text-xs text-muted-foreground">{alert.time}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Pending Approvals */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Key className="h-5 w-5 text-primary" />
//                 <span>Pending Approvals</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {pendingApprovals.map((item, index) => (
//                   <div key={index} className="p-3 border rounded-lg hover:border-primary/20 transition-colors">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="text-sm font-medium">{item.type}</div>
//                       <Badge 
//                         variant="outline"
//                         className={
//                           item.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
//                           item.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
//                           'bg-blue-50 text-blue-700 border-blue-200'
//                         }
//                       >
//                         {item.priority}
//                       </Badge>
//                     </div>
//                     <div className="text-sm text-muted-foreground mb-2">{item.item}</div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-xs text-muted-foreground">From: {item.user}</span>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="outline">Reject</Button>
//                         <Button size="sm">Approve</Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Dataset Management */}
//         <Card className="mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Database className="h-5 w-5 text-primary" />
//               <span>All Datasets (Administrative View)</span>
//             </CardTitle>
//             <CardDescription>
//               Complete access to all datasets in the repository with administrative controls
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <DatasetTable userAccessLevel="admin" />
//           </CardContent>
//         </Card>

//         {/* Admin Tools */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <Users className="h-12 w-12 text-primary mx-auto mb-4" />
//               <h3 className="font-semibold mb-2">User Management</h3>
//               <p className="text-sm text-muted-foreground">
//                 Manage user accounts and access levels
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <Database className="h-12 w-12 text-primary mx-auto mb-4" />
//               <h3 className="font-semibold mb-2">Data Management</h3>
//               <p className="text-sm text-muted-foreground">
//                 Upload, edit, and manage datasets
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
//               <h3 className="font-semibold mb-2">System Settings</h3>
//               <p className="text-sm text-muted-foreground">
//                 Configure system parameters
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
//             <CardContent className="p-6 text-center">
//               <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
//               <h3 className="font-semibold mb-2">Security Audit</h3>
//               <p className="text-sm text-muted-foreground">
//                 Review security logs and reports
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Database, Users, Settings, AlertTriangle,
  Activity, Server, Key, LogOut
} from "lucide-react";
import DatasetTable from "@/components/DatasetTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth session if you’re using localStorage/sessionStorage
    // localStorage.removeItem("authToken");
    navigate("/"); // redirect to Home page
  };

  const systemMetrics = [
    { title: "Total Datasets", value: "20", icon: Database, status: "healthy", change: "+2" },
    { title: "Active Users", value: "147", icon: Users, status: "healthy", change: "+12" },
    { title: "System Uptime", value: "99.8%", icon: Server, status: "healthy", change: "0%" },
    { title: "Data Quality", value: "96.4%", icon: Activity, status: "warning", change: "-1.2%" },
  ];

  const userActivity = [
    { week: "W1", public: 45, partners: 12, admin: 8 },
    { week: "W2", public: 52, partners: 15, admin: 6 },
    { week: "W3", public: 38, partners: 18, admin: 12 },
    { week: "W4", public: 61, partners: 14, admin: 9 },
  ];

  const dataQuality = [
    { month: "Aug", completeness: 94, accuracy: 96, timeliness: 89 },
    { month: "Sep", completeness: 96, accuracy: 95, timeliness: 92 },
    { month: "Oct", completeness: 95, accuracy: 97, timeliness: 94 },
    { month: "Nov", completeness: 97, accuracy: 96, timeliness: 91 },
    { month: "Dec", completeness: 96, accuracy: 98, timeliness: 96 },
  ];

  const systemAlerts = [
    { type: "warning", message: "DHIS2 API connection intermittent", time: "2 hours ago" },
    { type: "info", message: "Monthly data backup completed successfully", time: "1 day ago" },
    { type: "warning", message: "Storage capacity at 78%", time: "2 days ago" },
    { type: "success", message: "Security scan completed - no issues found", time: "3 days ago" },
  ];

  const pendingApprovals = [
    { type: "Dataset Submission", item: "Community Health Survey 2024", user: "NGO Partner", priority: "Medium" },
    { type: "User Access Request", item: "Enhanced Access Request", user: "Development Partner", priority: "High" },
    { type: "Data Update", item: "TB Unit Data Q4", user: "MoH TB Unit", priority: "Low" },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2">
                System Administration
              </h1>
              <p className="text-muted-foreground">
                Anambra State Government - Full Administrative Access
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                <Shield className="h-4 w-4 mr-2" />
                Admin Access
              </Badge>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* System Status */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-900">System Status: Operational</h3>
                    <p className="text-amber-700">
                      All systems running normally. Last maintenance: Jan 15, 2024
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            const getStatusColor = (status: string) => {
              switch (status) {
                case "healthy":
                  return "text-green-600";
                case "warning":
                  return "text-amber-600";
                case "error":
                  return "text-red-600";
                default:
                  return "text-gray-600";
              }
            };

            return (
              <Card key={index} className="hover:shadow-card transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className={`text-sm mt-1 ${getStatusColor(metric.status)}`}>
                        {metric.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span>User Activity Trends</span>
              </CardTitle>
              <CardDescription>Weekly active users by access level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="public" fill="#10b981" name="Public Users" />
                    <Bar dataKey="partners" fill="#3b82f6" name="Partners" />
                    <Bar dataKey="admin" fill="#f59e0b" name="Administrators" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Data Quality Metrics</span>
              </CardTitle>
              <CardDescription>Monthly data quality indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataQuality}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="completeness" stroke="#10b981" strokeWidth={2} name="Completeness %" />
                    <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} name="Accuracy %" />
                    <Line type="monotone" dataKey="timeliness" stroke="#f59e0b" strokeWidth={2} name="Timeliness %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts & Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => {
                  const getAlertColor = (type: string) => {
                    switch (type) {
                      case "warning":
                        return "border-l-amber-500 bg-amber-50";
                      case "error":
                        return "border-l-red-500 bg-red-50";
                      case "success":
                        return "border-l-green-500 bg-green-50";
                      default:
                        return "border-l-blue-500 bg-blue-50";
                    }
                  };

                  return (
                    <div
                      key={index}
                      className={`p-3 border-l-4 rounded-r-lg ${getAlertColor(alert.type)}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-primary" />
                <span>Pending Approvals</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">{item.type}</div>
                      <Badge
                        variant="outline"
                        className={
                          item.priority === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : item.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{item.item}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">From: {item.user}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reject
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dataset Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>All Datasets (Administrative View)</span>
            </CardTitle>
            <CardDescription>
              Complete access to all datasets in the repository with administrative controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DatasetTable userAccessLevel="admin" />
          </CardContent>
        </Card>

        {/* Admin Tools */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground">Manage user accounts and access levels</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Database className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Data Management</h3>
              <p className="text-sm text-muted-foreground">Upload, edit, and manage datasets</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-muted-foreground">Configure system parameters</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Security Audit</h3>
              <p className="text-sm text-muted-foreground">Review security logs and reports</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
