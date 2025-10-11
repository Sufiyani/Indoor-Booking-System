import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const dashboardCards = [
    {
      title: "Manage Bookings",
      description: "Create, update, and organize court reservations with complete control",
      icon: "📋",
      route: "/admin/manage-bookings",
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "hover:from-emerald-600 hover:to-teal-700",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      stats: "Full Control"
    },
    {
      title: "View Bookings",
      description: "Monitor all court reservations and track booking schedules in real-time",
      icon: "👁️",
      route: "/admin/view-booking-page",
      gradient: "from-blue-500 to-cyan-600",
      hoverGradient: "hover:from-blue-600 hover:to-cyan-700",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100",
      stats: "Live View"
    }
  ];

  const quickStats = [
    { label: "Total Courts", value: "3", icon: "🏟️", color: "from-green-500 to-emerald-600" },
    { label: "Active Admin", value: "1", icon: "👤", color: "from-blue-500 to-cyan-600" },
    { label: "System Status", value: "Online", icon: "✅", color: "from-purple-500 to-pink-600" },
    { label: "Quick Access", value: "Ready", icon: "⚡", color: "from-orange-500 to-red-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section with Time */}
        <div className="mb-8 sm:mb-12">
          {/* Time and Date Display */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-600 text-sm sm:text-base mb-1">{formatDate()}</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1a6868] to-[#89cfcf] bg-clip-text text-transparent">
                  {formatTime()}
                </p>
              </div>
             
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center bg-gradient-to-r from-[#1e9797]/10 to-[#89cfcf]/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 border border-white/30">
            <div className="inline-block mb-3">
              <span className="text-4xl sm:text-5xl lg:text-6xl">👋</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {getGreeting()}, <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">{adminName || "Admin"}</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Welcome back to your command center
            </p>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#1e9797] rounded-full"></div>
              <span className="text-3xl sm:text-4xl">⚙️</span>
              <div className="h-1 w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#1e9797] rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#258181] to-[#8cd3d3] bg-clip-text text-transparent mb-3 sm:mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
            Manage users, bookings, and content efficiently with powerful tools at your fingertips
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {quickStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/40 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{stat.icon}</div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{stat.label}</p>
              <p className={`text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative p-6 sm:p-8 lg:p-10">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${card.iconBg} rounded-2xl mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <span className="text-3xl sm:text-4xl lg:text-5xl">{card.icon}</span>
                </div>

                {/* Badge */}
                <div className="inline-block mb-3 sm:mb-4">
                  <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${card.gradient} text-white shadow-md`}>
                    {card.stats}
                  </span>
                </div>

                {/* Title */}
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                  {card.description}
                </p>

                {/* Button */}
                <button
                  onClick={() => navigate(card.route)}
                  className={`w-full bg-gradient-to-r ${card.gradient} ${card.hoverGradient} px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3`}
                >
                  <span>Access Now</span>
                  <span className="text-xl sm:text-2xl">→</span>
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/20 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/20 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>

        {/* Bottom Info Section */}
        <div className="bg-gradient-to-r from-[#1e9797]/10 to-[#89cfcf]/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 border border-white/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-2">🎯</div>
              <h3 className="font-bold text-[#1e9797] mb-1 text-sm sm:text-base">Mission Control</h3>
              <p className="text-xs sm:text-sm text-gray-600">Everything you need in one place</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl sm:text-4xl mb-2">🚀</div>
              <h3 className="font-bold text-[#1e9797] mb-1 text-sm sm:text-base">High Performance</h3>
              <p className="text-xs sm:text-sm text-gray-600">Lightning-fast operations</p>
            </div>
            <div className="text-center p-4 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-2">🔒</div>
              <h3 className="font-bold text-[#1e9797] mb-1 text-sm sm:text-base">Secure Access</h3>
              <p className="text-xs sm:text-sm text-gray-600">Protected admin environment</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;