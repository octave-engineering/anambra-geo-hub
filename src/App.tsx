


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
//                     <Routes>
//                       <Route path="/" element={<HomePage />} />
//                       <Route path="/about" element={<AboutPage />} />
//                       <Route path="/repository" element={<RepositoryPage />} />
//                       <Route path="/submit" element={<SubmitDataPage />} />
//                       <Route path="/analytics" element={<AnalyticsPage />} />

//                       {/* Dashboard routes */}
//                       <Route path="/dashboard/public" element={<PublicDashboard />} />
//                       <Route path="/dashboard/partner" element={<PartnerDashboard />} />
//                       <Route path="/dashboard/admin" element={<AdminDashboard />} />

//                       {/* Catch-all route */}
//                       <Route path="*" element={<NotFound />} />
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

import HomePage from "@/pages/HomePage";
import RepositoryPage from "@/pages/RepositoryPage";
import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SubmitDataPage from "@/pages/SubmitDataPage";

import PublicDashboard from "@/pages/dashboards/PublicDashboard";
import PartnerDashboard from "@/pages/dashboards/PartnerDashboard";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* ✅ ensures page scroll resets on route change */}
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Login page without header/footer */}
            <Route path="/login" element={<LoginPage />} />

            {/* Pages with header/footer */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/repository" element={<RepositoryPage />} />
                      <Route path="/submit" element={<SubmitDataPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />

                      {/* Dashboard routes */}
                      <Route path="/dashboard/public" element={<PublicDashboard />} />
                      <Route path="/dashboard/partner" element={<PartnerDashboard />} />
                      <Route path="/dashboard/admin" element={<AdminDashboard />} />

                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ChatBot />
                </>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
