import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import NavbarSection from "./components/Navbar";
import FooterSection from "./components/Footer";

// Pages
import GalleryCards from "./pages/user/Gallery";
import AboutUsSection from "./pages/user/AboutUs";
import ContactUsSection from "./pages/user/ContactUs";

// Court Details
import CricketGroundDetail from './pages/user/CricketGround';
import FutsalGroundDetail from './pages/user/FutsalGround';
import PadelGroundDetail from './pages/user/PadelGround';

import CricketPage from "./pages/user/Cricket";
import FutsalPage from "./pages/user/Futsal";
import PadelPage from "./pages/user/Padel";

// Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCourtCards from './pages/Admin/CourtCards'
import ViewCricketBooking from './pages/Admin/ViewCricketBooking';
import ViewFutsalBooking from './pages/Admin/viewFutsalBooking'
import ViewPadelBooking from './pages/Admin/viewPadelBooking'


import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const location = useLocation();
  
  const isHome = location.pathname === "/";
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Navbar */}
      <NavbarSection />

      {/* Page content */}
      <div className="flex-grow">
        <Routes>
          {/* Home page */}
          <Route
            path="/"
            element={
              <div className="pt-15">
                <GalleryCards />
                <AboutUsSection />
                <ContactUsSection />
              </div>
            }
          />

          {/* Court Details */}
          <Route path="/cricket-ground" element={<CricketGroundDetail />} />
          <Route path="/futsal-ground" element={<FutsalGroundDetail />} />
          <Route path="/padel-ground" element={<PadelGroundDetail />} />

          {/* Sports pages */}
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/futsal" element={<FutsalPage />} />
          <Route path="/padel" element={<PadelPage />} />

          {/* Admin routes */}
          {/* <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/gallery" element={<AdminCourtCards />} />
          <Route path="/admin/view-booking-page" element={<ViewCricketBooking />} />
          <Route path="/admin/view-futsal-page" element={<ViewFutsalBooking />} />
          <Route path="/admin/view-padel-page" element={<ViewPadelBooking />} /> */}


          {/* Admin routes */}
<Route path="/admin/login" element={<AdminLogin />} />
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/gallery" 
  element={
    <ProtectedRoute>
      <AdminCourtCards />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/view-booking-page" 
  element={
    <ProtectedRoute>
      <ViewCricketBooking />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/view-futsal-page" 
  element={
    <ProtectedRoute>
      <ViewFutsalBooking />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/view-padel-page" 
  element={
    <ProtectedRoute>
      <ViewPadelBooking />
    </ProtectedRoute>
  } 
/>

        </Routes>
      </div>

      {/* Footer with conditional props */}
      <FooterSection 
        showAdmin={isHome} 
        showAdminLogout={isAdminDashboard} 
      />
    </div>
  );
};

export default App;
