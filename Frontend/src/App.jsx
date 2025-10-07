import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import NavbarSection from "./components/Navbar";
import FooterSection from "./components/Footer";


import GalleryCards from "./pages/user/Gallery";
import AboutUsSection from "./pages/user/AboutUs";
import ContactUsSection from "./pages/user/ContactUs";


import CricketGroundDetail from './pages/user/CricketGround';
import FutsalGroundDetail from './pages/user/FutsalGround';
import PadelGroundDetail from './pages/user/PadelGround';

import CricketPage from "./pages/user/Cricket";
import FutsalPage from "./pages/user/Futsal";
import PadelPage from "./pages/user/Padel";

import PaymentMethodForm from './pages/user/PaymentForm'

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCourtCards from './pages/Admin/CourtCards'
import ViewBooking from './pages/Admin/ViewBooking';
import ManageBookings from "./pages/Admin/ManageBookings";

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Navbar */}
      {/* <NavbarSection /> */}

    
      <div className="flex-grow">
        <Routes>
       
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


          <Route path="/cricket-ground" element={<CricketGroundDetail />} />
          <Route path="/futsal-ground" element={<FutsalGroundDetail />} />
          <Route path="/padel-ground" element={<PadelGroundDetail />} />

        
          <Route path="/cricket" element={<CricketPage />} />
          <Route path="/futsal" element={<FutsalPage />} />
          <Route path="/padel" element={<PadelPage />} />

     
          <Route path="/payment-method" element={<PaymentMethodForm />} />

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
            path="/admin/view-booking-page"
            element={
              <ProtectedRoute>
                <ViewBooking />
              </ProtectedRoute>
            }
          />
              <Route
            path="/admin/manage-bookings"
            element={
              <ProtectedRoute>
                <ManageBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <FooterSection
        showAdmin={isHome}
        showAdminLogout={isAdminDashboard}
      />
    </div>
  );
};

export default App;
