// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Map, BarChart3, Download, Eye, Calendar, TrendingUp, Activity } from "lucide-react";
// import { Link } from "react-router-dom";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const PublicDashboard = () => {
//   // Public datasets
//   const publicDatasets = [
//     { name: "Malaria Cases", category: "Disease", lastUpdate: "2024-01-20", access: "Public" },
//     { name: "PHC Facilities", category: "Infrastructure", lastUpdate: "2024-01-15", access: "Public" },
//     { name: "Population Data", category: "Demographics", lastUpdate: "2024-01-01", access: "Public" },
//     { name: "Immunization Coverage", category: "Disease Prevention", lastUpdate: "2024-01-18", access: "Public" },
//   ];

//   // Key disease metrics (overview)
//   const diseaseOverview = [
//     { disease: "Malaria", cases: 2847, trend: "+12%", color: "#f59e0b" },
//     { disease: "Maternal Health", cases: 456, trend: "+5%", color: "#3b82f6" },
//     { disease: "Child Health", cases: 678, trend: "-3%", color: "#10b981" },
//     { disease: "Immunization", cases: 892, trend: "+8%", color: "#8b5cf6" },
//   ];

//   // All 21 LGAs in Anambra
//   const lgaData = [
//     { name: "Aguata", population: 180000, facilities: 20, malaria: 320, maternal: 50, immunization: 210 },
//     { name: "Awka North", population: 125000, facilities: 12, malaria: 210, maternal: 30, immunization: 150 },
//     { name: "Awka South", population: 180000, facilities: 18, malaria: 250, maternal: 40, immunization: 180 },
//     { name: "Anambra East", population: 140000, facilities: 15, malaria: 280, maternal: 45, immunization: 170 },
//     { name: "Anambra West", population: 135000, facilities: 14, malaria: 230, maternal: 35, immunization: 140 },
//     { name: "Anaocha", population: 160000, facilities: 16, malaria: 260, maternal: 38, immunization: 190 },
//     { name: "Ayamelum", population: 150000, facilities: 13, malaria: 240, maternal: 34, immunization: 160 },
//     { name: "Dunukofia", population: 120000, facilities: 11, malaria: 180, maternal: 28, immunization: 130 },
//     { name: "Ekwusigo", population: 155000, facilities: 14, malaria: 210, maternal: 33, immunization: 145 },
//     { name: "Idemili North", population: 200000, facilities: 22, malaria: 310, maternal: 48, immunization: 220 },
//     { name: "Idemili South", population: 170000, facilities: 17, malaria: 270, maternal: 42, immunization: 180 },
//     { name: "Ihiala", population: 210000, facilities: 23, malaria: 330, maternal: 55, immunization: 240 },
//     { name: "Njikoka", population: 150000, facilities: 15, malaria: 230, maternal: 37, immunization: 160 },
//     { name: "Nnewi North", population: 145000, facilities: 15, malaria: 220, maternal: 34, immunization: 150 },
//     { name: "Nnewi South", population: 175000, facilities: 18, malaria: 280, maternal: 39, immunization: 175 },
//     { name: "Ogbaru", population: 190000, facilities: 19, malaria: 290, maternal: 43, immunization: 185 },
//     { name: "Onitsha North", population: 220000, facilities: 25, malaria: 350, maternal: 58, immunization: 260 },
//     { name: "Onitsha South", population: 165000, facilities: 20, malaria: 270, maternal: 44, immunization: 175 },
//     { name: "Orumba North", population: 140000, facilities: 13, malaria: 210, maternal: 31, immunization: 140 },
//     { name: "Orumba South", population: 130000, facilities: 12, malaria: 200, maternal: 29, immunization: 135 },
//     { name: "Oyi", population: 160000, facilities: 15, malaria: 240, maternal: 35, immunization: 160 },
//   ];

//   return (
//     <div className="min-h-screen py-8">
//       <div className="container mx-auto px-4">

//         {/* Welcome Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2">
//                 Public Health Dashboard
//               </h1>
//               <p className="text-muted-foreground">
//                 Welcome! You have public access to health data and analytics.
//               </p>
//             </div>
//             <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
//               Public Access
//             </Badge>
//           </div>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           {diseaseOverview.map((item, index) => (
//             <Card key={index} className="hover:shadow-card transition-all duration-200">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="text-sm text-muted-foreground">{item.disease}</div>
//                   <div className={`text-sm ${item.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
//                     {item.trend}
//                   </div>
//                 </div>
//                 <div className="text-2xl font-bold text-foreground">{item.cases.toLocaleString()}</div>
//                 <div className="text-xs text-muted-foreground">This month</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Charts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

//           {/* Population by LGA */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Map className="h-5 w-5 text-primary" />
//                 <span>Population by LGA</span>
//               </CardTitle>
//               <CardDescription>
//                 Population distribution across 21 LGAs
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={lgaData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip formatter={(value) => [value.toLocaleString(), "Population"]} />
//                     <Bar dataKey="population" fill="#f59e0b" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Disease Cases by LGA (Interactive) */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <BarChart3 className="h-5 w-5 text-primary" />
//                 <span>Disease Cases by LGA</span>
//               </CardTitle>
//               <CardDescription>
//                 Explore Malaria, Maternal Health, and Immunization across LGAs
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="h-96">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={lgaData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="malaria" stackId="a" fill="#f87171" name="Malaria" />
//                     <Bar dataKey="maternal" stackId="a" fill="#60a5fa" name="Maternal Health" />
//                     <Bar dataKey="immunization" stackId="a" fill="#34d399" name="Immunization" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PublicDashboard;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PublicDashboard = () => {
  // Public datasets
  const publicDatasets = [
    { name: "Malaria Cases", category: "Disease", lastUpdate: "2024-01-20", access: "Public" },
    { name: "PHC Facilities", category: "Infrastructure", lastUpdate: "2024-01-15", access: "Public" },
    { name: "Population Data", category: "Demographics", lastUpdate: "2024-01-01", access: "Public" },
    { name: "Immunization Coverage", category: "Disease Prevention", lastUpdate: "2024-01-18", access: "Public" },
  ];

  // Key disease metrics (overview)
  const diseaseOverview = [
    { disease: "Malaria", cases: 2847, trend: "+12%", color: "#f59e0b" },
    { disease: "Maternal Health", cases: 456, trend: "+5%", color: "#3b82f6" },
    { disease: "Child Health", cases: 678, trend: "-3%", color: "#10b981" },
    { disease: "Immunization", cases: 892, trend: "+8%", color: "#8b5cf6" },
  ];

  // All 21 LGAs in Anambra
  const lgaData = [
    { name: "Aguata", population: 180000, facilities: 20, malaria: 320, maternal: 50, immunization: 210 },
    { name: "Awka North", population: 125000, facilities: 12, malaria: 210, maternal: 30, immunization: 150 },
    { name: "Awka South", population: 180000, facilities: 18, malaria: 250, maternal: 40, immunization: 180 },
    { name: "Anambra East", population: 140000, facilities: 15, malaria: 280, maternal: 45, immunization: 170 },
    { name: "Anambra West", population: 135000, facilities: 14, malaria: 230, maternal: 35, immunization: 140 },
    { name: "Anaocha", population: 160000, facilities: 16, malaria: 260, maternal: 38, immunization: 190 },
    { name: "Ayamelum", population: 150000, facilities: 13, malaria: 240, maternal: 34, immunization: 160 },
    { name: "Dunukofia", population: 120000, facilities: 11, malaria: 180, maternal: 28, immunization: 130 },
    { name: "Ekwusigo", population: 155000, facilities: 14, malaria: 210, maternal: 33, immunization: 145 },
    { name: "Idemili North", population: 200000, facilities: 22, malaria: 310, maternal: 48, immunization: 220 },
    { name: "Idemili South", population: 170000, facilities: 17, malaria: 270, maternal: 42, immunization: 180 },
    { name: "Ihiala", population: 210000, facilities: 23, malaria: 330, maternal: 55, immunization: 240 },
    { name: "Njikoka", population: 150000, facilities: 15, malaria: 230, maternal: 37, immunization: 160 },
    { name: "Nnewi North", population: 145000, facilities: 15, malaria: 220, maternal: 34, immunization: 150 },
    { name: "Nnewi South", population: 175000, facilities: 18, malaria: 280, maternal: 39, immunization: 175 },
    { name: "Ogbaru", population: 190000, facilities: 19, malaria: 290, maternal: 43, immunization: 185 },
    { name: "Onitsha North", population: 220000, facilities: 25, malaria: 350, maternal: 58, immunization: 260 },
    { name: "Onitsha South", population: 165000, facilities: 20, malaria: 270, maternal: 44, immunization: 175 },
    { name: "Orumba North", population: 140000, facilities: 13, malaria: 210, maternal: 31, immunization: 140 },
    { name: "Orumba South", population: 130000, facilities: 12, malaria: 200, maternal: 29, immunization: 135 },
    { name: "Oyi", population: 160000, facilities: 15, malaria: 240, maternal: 35, immunization: 160 },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-2">
                Public Health Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome! You have public access to health data and analytics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Public Access
              </Badge>

              {/* Logout button */}
              <Button asChild variant="outline">
                <Link to="/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {diseaseOverview.map((item, index) => (
            <Card key={index} className="hover:shadow-card transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">{item.disease}</div>
                  <div className={`text-sm ${item.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {item.trend}
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{item.cases.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Population by LGA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Map className="h-5 w-5 text-primary" />
                <span>Population by LGA</span>
              </CardTitle>
              <CardDescription>
                Population distribution across 21 LGAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lgaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), "Population"]} />
                    <Bar dataKey="population" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Disease Cases by LGA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>Disease Cases by LGA</span>
              </CardTitle>
              <CardDescription>
                Explore Malaria, Maternal Health, and Immunization across LGAs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lgaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="malaria" stackId="a" fill="#f87171" name="Malaria" />
                    <Bar dataKey="maternal" stackId="a" fill="#60a5fa" name="Maternal Health" />
                    <Bar dataKey="immunization" stackId="a" fill="#34d399" name="Immunization" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
