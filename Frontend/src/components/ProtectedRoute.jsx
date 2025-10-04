// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { adminService } from '../services/adminService';

// const ProtectedRoute = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const verifyAuth = async () => {
//       const token = localStorage.getItem('adminToken');
//       if (!token) {
//         setIsAuthenticated(false);
//         setLoading(false);
//         return;
//       }

//       try {
//         await adminService.verify();
//         setIsAuthenticated(true);
//       } catch (err) {
//         localStorage.removeItem('adminToken');
//         localStorage.removeItem('adminName');
//         localStorage.removeItem('adminEmail');
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     verifyAuth();
//   }, []);

//   if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Verifying...</div>;

//   return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
// };

// export default ProtectedRoute;



import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminService } from "../services/adminService";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await adminService.verify();
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Verifying...</div>;

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
