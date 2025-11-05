


// import "leaflet/dist/leaflet.css";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ChatBot from "@/components/ChatBot";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import ScrollToTop from "@/components/ScrollToTop"; // ✅ Correct path

// import HomePage from "@/pages/HomePage";
// import RepositoryPage from "@/pages/RepositoryPage";
// import LoginPage from "@/pages/LoginPage";
// import Logout from "@/pages/Logout";
// import AboutPage from "@/pages/AboutPage";
// import AnalyticsPage from "@/pages/AnalyticsPage";
// import SubmitDataPage from "@/pages/SubmitDataPage";
// import ToolsPage from "@/pages/ToolsPage";

// import PublicDashboard from "@/pages/dashboards/PublicDashboard";
// import PartnerDashboard from "@/pages/dashboards/PartnerDashboard";
// import AdminDashboard from "@/pages/dashboards/AdminDashboard";
// import NotFound from "@/pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         {/* ScrollToTop ensures page scroll resets on route change */}
//         <ScrollToTop />
//         <div className="min-h-screen flex flex-col">
//           <Routes>
//             {/* Routes without header/footer */}
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/logout" element={<Logout />} />

//             {/* Routes with header/footer */}
//             <Route
//               path="/*"
//               element={
//                 <>
//                   <Header />
//                   <main className="flex-1">
//                     </Routes>
//                   </main>
//                   <Footer />
//                 </>
//               }
//             />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop"; // ✅ added
import BackToTop from "@/components/BackToTop";

import HomePage from "@/pages/HomePage";
import RepositoryPage from "@/pages/RepositoryPage";
import LoginPage from "@/pages/LoginPage";
import Logout from "@/pages/Logout";
import AboutPage from "@/pages/AboutPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SubmitDataPage from "@/pages/SubmitDataPage";
import LearningPage from "@/pages/LearningPage";
import DatasetsList from "@/pages/Datasets/DatasetsList";
import DatasetDetail from "@/pages/Datasets/DatasetDetail";
import DataPortal from "@/pages/DataPortal";

import PublicDashboard from "@/pages/dashboards/PublicDashboard";
import PartnerDashboard from "@/pages/dashboards/PartnerDashboard";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import GisMappingPage from "@/pages/GisMappingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Use Vite's BASE_URL so dev uses root ("/") and prod uses the repo subpath ("/anambra-geo-hub/")
  // React Router expects basename without a trailing slash
  const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/dataportal" element={<DataPortal />} />
                <Route path="/repository" element={<DataPortal />} />
                <Route path="/datasets" element={<DatasetsList />} />
                <Route path="/datasets/:id" element={<DatasetDetail />} />
                <Route path="/gis-mapping" element={<GisMappingPage />} />
                <Route path="/submit" element={<SubmitDataPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/tools" element={<LearningPage />} />
                <Route path="/learning" element={<LearningPage />} />
                
                {/* Dashboard routes */}
                <Route path="/dashboard/public" element={<PublicDashboard />} />
                <Route path="/dashboard/partner" element={<PartnerDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/logout" element={<Logout />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
            <BackToTop />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
