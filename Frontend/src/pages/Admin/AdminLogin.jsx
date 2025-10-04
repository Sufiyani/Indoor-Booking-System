// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AdminLogin = () => {
//   const ADMIN_PASSWORD = "Admin@123"; // Change as needed
//   const [password, setPassword] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState("error"); // "error" or "success"
  
//   const navigate = useNavigate();

//   // Auto-hide popup after 2.5s
//   useEffect(() => {
//     if (!showPopup) return;
//     const t = setTimeout(() => setShowPopup(false), 2500);
//     return () => clearTimeout(t);
//   }, [showPopup]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (password === ADMIN_PASSWORD) {
//       setPopupType("success");
//       setShowPopup(true);

//       // Redirect to dashboard after short delay to show popup
//       setTimeout(() => {
//         navigate("/admin/dashboard");
//       }, 800);
//     } else {
//       setPopupType("error");
//       setShowPopup(true);
//     }
//   };

//   const closePopup = () => setShowPopup(false);

//   return (
//     <div className="py-16 px-6 bg-black min-h-screen flex items-center justify-center">
//       <div className="w-11/12 max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//         <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-8 animate-pulse">
//           Admin Login
//         </h2>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="text-center">
//             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
//               Welcome <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-bounce">userName</span> to Admin Portal
//             </h1>
//             <p className="mt-1 text-gray-300 text-base tracking-wide">
//               Manage your dashboard efficiently
//             </p>
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-2 font-medium">Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-gray-400 text-sm mt-4 text-center">
//           Only authorized admins can access the dashboard.
//         </p>
//       </div>

//       {/* Popup overlay */}
//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={closePopup}
//           />
//           <div className="relative z-10 w-11/12 max-w-md mx-auto">
//             <div
//               className={`rounded-2xl p-6 shadow-2xl border border-white/10 transform transition duration-200
//                 ${popupType === "success" ? "bg-white/6" : "bg-black/75"}`}
//             >
//               <div className="flex items-start gap-4">
//                 <div
//                   className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white
//                     ${popupType === "success" ? "bg-emerald-500" : "bg-red-500"}`}
//                 >
//                   {popupType === "success" ? "✓" : "!"}
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-white">
//                     {popupType === "success" ? "Login successful" : "Wrong password"}
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-300">
//                     {popupType === "success"
//                       ? "Redirecting to dashboard..."
//                       : "Please enter the correct admin password."}
//                   </p>
//                 </div>

//                 <button
//                   onClick={closePopup}
//                   className="ml-4 self-start text-gray-300 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLogin;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminService } from "../../services/adminService";

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//   });
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState("error");
//   const [popupMessage, setPopupMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Auto-redirect if already logged in
//     const token = localStorage.getItem("adminToken");
//     if (token) navigate("/admin/dashboard");
//   }, [navigate]);

//   // Auto-hide popup after 2.5s
//   useEffect(() => {
//     if (!showPopup) return;
//     const t = setTimeout(() => setShowPopup(false), 2500);
//     return () => clearTimeout(t);
//   }, [showPopup]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const response = await adminService.login(formData.name, formData.password);

//     if (response.success) {
//       localStorage.setItem("adminToken", response.token);
//       localStorage.setItem("adminName", response.data.name);
//       // REMOVE THIS LINE: localStorage.setItem("adminEmail", response.data.email);

//       setPopupType("success");
//       setPopupMessage("Login successful! Redirecting...");
//       setShowPopup(true);

//       setTimeout(() => navigate("/admin/dashboard"), 800);
//     }
//   } catch (error) {
//     setPopupType("error");
//     setPopupMessage(error.response?.data?.message || "Invalid credentials");
//     setShowPopup(true);
//   } finally {
//     setLoading(false);
//   }
// };
//   const closePopup = () => setShowPopup(false);

//   return (
//     <div className="py-16 px-6 bg-black min-h-screen flex items-center justify-center">
//       <div className="w-11/12 max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//         <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-8 animate-pulse">
//           Admin Login
//         </h2>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="text-center mb-6">
//             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
//               Welcome to <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-bounce">Admin Portal</span>
//             </h1>
//             <p className="mt-1 text-gray-300 text-base tracking-wide">
//               Manage your dashboard efficiently
//             </p>
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-2 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-2 font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-gray-400 text-sm mt-4 text-center">
//           Only authorized admins can access the dashboard.
//         </p>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
//           <div className="relative z-10 w-11/12 max-w-md mx-auto">
//             <div
//               className={`rounded-2xl p-6 shadow-2xl border border-white/10 transform transition duration-200
//                 ${popupType === "success" ? "bg-white/6" : "bg-black/75"}`}
//             >
//               <div className="flex items-start gap-4">
//                 <div
//                   className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white
//                     ${popupType === "success" ? "bg-emerald-500" : "bg-red-500"}`}
//                 >
//                   {popupType === "success" ? "✓" : "!"}
//                 </div>

//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-white">
//                     {popupType === "success" ? "Success" : "Error"}
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-300">{popupMessage}</p>
//                 </div>

//                 <button onClick={closePopup} className="ml-4 self-start text-gray-300 hover:text-white">
//                   ✕
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLogin;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { adminService } from "../../services/adminService";

// const AdminLogin = () => {
//   const [formData, setFormData] = useState({ name: "", password: "" });
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState("error");
//   const [popupMessage, setPopupMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (token) navigate("/admin/dashboard");
//   }, [navigate]);

//   useEffect(() => {
//     if (!showPopup) return;
//     const t = setTimeout(() => setShowPopup(false), 2500);
//     return () => clearTimeout(t);
//   }, [showPopup]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await adminService.login(formData.name, formData.password);
//       console.log("Login Response:", response);

//       localStorage.setItem("adminToken", response.token);
//       localStorage.setItem("adminName", response.admin.name);

//       setPopupType("success");
//       setPopupMessage("Login successful! Redirecting...");
//       setShowPopup(true);

//       setTimeout(() => navigate("/admin/dashboard"), 800);
//     } catch (error) {
//       setPopupType("error");
//       setPopupMessage(error.response?.data?.message || "Invalid credentials");
//       setShowPopup(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closePopup = () => setShowPopup(false);

//   return (
//     <div className="py-16 px-6 bg-black min-h-screen flex items-center justify-center">
//       <div className="w-11/12 max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
//         <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-8 animate-pulse">
//           Admin Login
//         </h2>

//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-gray-300 mb-2 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter your name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-2 font-medium">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-gray-400 text-sm mt-4 text-center">
//           Only authorized admins can access the dashboard.
//         </p>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
//           <div className="relative z-10 w-11/12 max-w-md mx-auto">
//             <div className={`rounded-2xl p-6 shadow-2xl border border-white/10 transform transition duration-200 ${popupType === "success" ? "bg-white/6" : "bg-black/75"}`}>
//               <div className="flex items-start gap-4">
//                 <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white ${popupType === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
//                   {popupType === "success" ? "✓" : "!"}
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold text-white">
//                     {popupType === "success" ? "Success" : "Error"}
//                   </h3>
//                   <p className="mt-1 text-sm text-gray-300">{popupMessage}</p>
//                 </div>
//                 <button onClick={closePopup} className="ml-4 self-start text-gray-300 hover:text-white">✕</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminLogin;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("error");
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/admin/dashboard");
  }, [navigate]);

  useEffect(() => {
    if (!showPopup) return;
    const t = setTimeout(() => setShowPopup(false), 2500);
    return () => clearTimeout(t);
  }, [showPopup]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminService.login(formData.name, formData.password);
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminName", response.admin.name);

      setPopupType("success");
      setPopupMessage("Login successful! Redirecting...");
      setShowPopup(true);

      setTimeout(() => navigate("/admin/dashboard"), 800);
    } catch (error) {
      setPopupType("error");
      setPopupMessage(error.response?.data?.message || "Invalid credentials");
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="py-16 px-6 bg-black min-h-screen flex items-center justify-center">
      <div className="w-11/12 max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-8 animate-pulse">
          Admin Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-2xl bg-gray-700/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Only authorized admins can access the dashboard.
        </p>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePopup} />
          <div className="relative z-10 w-11/12 max-w-md mx-auto">
            <div className={`rounded-2xl p-6 shadow-2xl border border-white/10 transform transition duration-200 ${popupType === "success" ? "bg-white/6" : "bg-black/75"}`}>
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white ${popupType === "success" ? "bg-emerald-500" : "bg-red-500"}`}>
                  {popupType === "success" ? "✓" : "!"}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {popupType === "success" ? "Success" : "Error"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-300">{popupMessage}</p>
                </div>
                <button onClick={closePopup} className="ml-4 self-start text-gray-300 hover:text-white">✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
