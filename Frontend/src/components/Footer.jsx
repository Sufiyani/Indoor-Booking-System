import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = ({ showAdmin, showAdminLogout }) => {
  const navigate = useNavigate();

  return (
    <footer className="relative text-gray-300 bg-[#1e9797]/10 py-12 px-6 mt-16 border-t border-[#9de9e9] backdrop-blur-xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

        {/* Brand / Logo */}
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#1a6868] to-[#9de9e9] bg-clip-text text-transparent">
            Indoor Management System
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            A modern way to manage bookings, explore indoor games, and enjoy premium facilities under one roof.
          </p>

          {/* Admin button sirf home page par */}
          {/* {showAdmin && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => navigate("/admin/login")}
                className="px-5 py-2 bg-gradient-to-r from-[#258181] to-[#8cd3d3] text-white font-semibold rounded-lg shadow-md transition"
              >
                Admin Login
              </button>
            </div>
          )} */}

          {/* Admin Logout button sirf dashboard page par */}
          {/* {showAdminLogout && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => navigate("/")} // Yahan navigate target change kar sakte ho agar login page chahiye
                className="px-5 py-2 bg-gradient-to-r from-[#258181] to-[#8cd3d3] text-white font-semibold rounded-lg shadow-md transition"
              >
                Admin Logout
              </button>
            </div>
          )} */}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-[#1e9797] mb-4 text-center">Quick Links</h3>
          <ul className="space-y-2 text-center text-gray-600">
            <li>
              <a href="#gallery" className="hover:text-[#087e7e] transition">Gallery</a>
            </li>
            <li>
              <a href="#about us" className="hover:text-[#087e7e] transition">About Us</a>
            </li>
            <li>
              <a href="#contact us" className="hover:text-[#087e7e] transition">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-[#1e9797] mb-4">Contact Info</h3>
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <Mail className="text-[#1e9797] w-5 h-5" />
            <span className="text-gray-600">info@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <Phone className="text-[#1e9797] w-5 h-5" />
            <span className="text-gray-600">+92 330 1234567</span>
          </div>
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <MapPin className="text-[#1e9797] w-5 h-5" />
            <span className="text-gray-600">North Nazimabad, Karachi</span>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
              <Facebook size={22} />
            </a>
            <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
              <Instagram size={22} />
            </a>
            <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-[95%] mx-auto text-center text-sm text-gray-600 mt-10 border-t border-white/20 pt-6">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#1e9797] font-semibold">Indoor Management System</span>. All Rights Reserved.
      </div>

    </footer>
  );
};

export default Footer;