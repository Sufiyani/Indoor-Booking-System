import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Detect scroll for active link
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const handleScroll = () => {
      let index = sections.length - 1;
      while (index >= 0 && window.scrollY + 120 < sections[index].offsetTop) {
        index--;
      }
      setActiveIndex(index);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/"); // redirect to home after logout
  };

  const navItems = ["Gallery", "About Us", "Contact Us"];

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <nav
      className="w-[90%] mx-auto fixed top-0 left-0 right-0 
      z-50 flex items-center justify-between px-4 sm:px-6 py-4 
      bg-[#FFF9E6]/90 backdrop-blur-xl rounded-b-3xl border border-[#9de9e9] shadow-2xl"
    >
      {/* Logo */}
      <div
        className="text-xl sm:text-2xl md:text-3xl 
        font-bold tracking-wide text-[#1e9797] italic cursor-pointer"
        onClick={() => navigate("/")}
      >
        Indoor Management System
      </div>

      {/* Menu Icon */}
      <div
        className="text-[#1e9797] text-3xl cursor-pointer md:hidden hover:text-[#087e7e] transition-colors"
        onClick={toggleMenu}
      >
        {isOpen ? "✘" : "☰"}
      </div>

      {/* Nav Links */}
      <ul
        className={`flex flex-col items-center justify-center
        md:flex-row md:items-center md:justify-start
        md:static absolute 
        ${isOpen ? "bg-green-50/95" : "md:bg-transparent bg-transparent"}
        text-[#1e9797]
        top-[72px] left-0 w-full md:w-auto
        transition-all duration-300 ease-in-out
        md:rounded-none rounded-2xl md:border-0 border border-green-100
        md:shadow-none shadow-2xl overflow-hidden
        px-5 gap-3 ${isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible md:opacity-100 md:visible"
        }`}
      >
        {navItems.map((item, index) => (
          <li key={item} className="mx-2 my-3 md:my-0 px-4 md:px-0">
            <a
              href={`#${item.toLowerCase()}`}
              className={`text-lg font-medium transition-all duration-300 relative group inline-block
              text-[#1e9797] hover:text-[#087e7e]
              `}
              onClick={() => setIsOpen(false)}
            >
              {item}
              <span
                className={`absolute bottom-0 left-0 h-0.5 
                bg-[#087e7e] transition-all duration-300
                ${activeIndex === index ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </a>
          </li>
        ))}

        {/* ✅ Show Admin Login on all non-admin routes */}
        {!isAdminRoute && (
          <li className="mx-2 my-3 md:my-0 px-4 md:px-0">
            <button
              onClick={() => navigate("/admin/login")}
              className="px-5 py-2 bg-gradient-to-r from-[#1a6868] to-[#89cfcf] font-bold rounded-lg text-white shadow-md hover:opacity-90 transition"
            >
              Admin Login
            </button>
          </li>
        )}

        {/* ✅ Show Logout only on admin routes */}
        {isAdminRoute && (
          <li className="mx-2 my-3 md:my-0 px-4 md:px-0">
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gradient-to-r from-[#1a6868] to-[#89cfcf] font-bold rounded-lg text-white shadow-md hover:opacity-90 transition"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
