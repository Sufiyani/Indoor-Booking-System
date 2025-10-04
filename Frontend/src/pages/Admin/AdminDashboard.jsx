// import React from "react";
// import { Mail, Phone, MapPin, User, Settings, ClipboardList } from "lucide-react";
// import { Link } from "react-router-dom";

// const AdminDashboard = () => {
//   const adminName = "Admin"; // You can set this dynamically later

//   return (
//     <div className="py-16 px-6 bg-black min-h-screen">
//       <div className="mt-15 max-w-6xl mx-auto">

//         {/* Welcome line */}
//         <div className="text-center mb-8">
//           <h2 className="text-2xl text-white font-semibold">
//             Hey <span className="text-orange-400">{adminName}</span>, welcome to Admin Dashboard
//           </h2>
//         </div>

//         {/* Heading */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
//             Admin Dashboard
//           </h1>
//           <p className="text-white text-lg">
//             Manage users, bookings, and content efficiently
//           </p>
//         </div>

//         {/* Admin action cards */}
//         <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
//           <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20 hover:-translate-y-2 transition-transform duration-500">
//             <h2 className="text-2xl font-semibold text-white mb-3">Manage Booking</h2>
//             <p className="text-gray-300 mb-4">
//               Add, edit or remove court Booking.
//             </p>
//             <button className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition duration-300">
//               Go
//             </button>
//           </div>

//           <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20 hover:-translate-y-2 transition-transform duration-500">
//             <h2 className="text-2xl font-semibold text-white mb-3">View Booking</h2>
//             <p className="text-gray-300 mb-4">
//               Check Your Court Reservation Schedule
//             </p>
//             <Link to="/admin/gallery">
//               <button className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition duration-300">
//                 Go
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { adminService } from "../../services/adminService";


// const AdminDashboard = () => {
//   const [adminName, setAdminName] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const name = localStorage.getItem('adminName');
//     if (name) setAdminName(name);
//   }, []);

//   const handleLogout = async () => {
//     try { await adminService.logout(); } catch {}
//     finally {
//       localStorage.clear();
//       navigate('/admin/login');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1>Welcome, {adminName}</h1>
//         <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
//       </div>

//       <div className="flex gap-4">
//         <button onClick={() => navigate('/admin/bookings')} className="bg-orange-500 p-4 rounded">View Bookings</button>
//         <button className="bg-green-500 p-4 rounded">Manage Booking</button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminService } from "../../services/adminService";

// const AdminDashboard = () => {
//   const [adminName, setAdminName] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const name = localStorage.getItem("adminName");
//     if (name) setAdminName(name);
//   }, []);

//   const handleLogout = async () => {
//     try { await adminService.logout(); } catch {}
//     finally {
//       localStorage.clear();
//       navigate("/admin/login");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1>Welcome, {adminName}</h1>
//         <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
//       </div>

//       <div className="flex gap-4">
//         <button onClick={() => navigate("/admin/bookings")} className="bg-orange-500 p-4 rounded">View Bookings</button>
//         <button className="bg-green-500 p-4 rounded">Manage Booking</button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="py-16 px-6 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-2xl text-white font-semibold">
            Hey <span className="text-orange-400">{adminName || "Admin"}</span>, welcome to Admin Dashboard
          </h2>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            Admin Dashboard
          </h1>
          <p className="text-white text-lg">
            Manage users, bookings, and content efficiently
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
          {/* Manage Booking */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20 hover:-translate-y-2 transition-transform duration-500 w-full md:w-1/3">
            <h2 className="text-2xl font-semibold text-white mb-3">Manage Booking</h2>
            <p className="text-gray-300 mb-4">
              Add, edit, or remove court bookings.
            </p>
            <button
              onClick={() => navigate("/admin/manage-booking")}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition duration-300"
            >
              Go
            </button>
          </div>

          {/* View Booking */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20 hover:-translate-y-2 transition-transform duration-500 w-full md:w-1/3">
            <h2 className="text-2xl font-semibold text-white mb-3">View Booking</h2>
            <p className="text-gray-300 mb-4">
              Check your court reservation schedule
            </p>
            <button
              onClick={() => navigate("/admin/bookings")}
              className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition duration-300"
            >
              Go
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 px-6 py-2 rounded-xl text-white font-semibold hover:opacity-90 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
