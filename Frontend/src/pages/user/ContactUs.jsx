import React, { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    const phoneNumber = "923303253692";
    const whatsappMessage = `Hello, my name is *${name}*.\nMy email is *${email}*.\n\nMessage:\n${message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div id="contact us" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-transparent">
      <div className="w-full sm:w-[95%] md:w-[90%] mx-auto text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1a6868] to-[#9de9e9] bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 px-2">
          Contact Us
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2">
          Have questions, suggestions, or want to book with us? We'd love to hear
          from you. Reach out through the details below or send us a quick message
          using the contact form.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left mb-8 sm:mb-10 md:mb-12">
          {/* Email */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 text-center border border-white/20">
            <Mail className="mx-auto text-[#1e9797] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#1e9797] mb-1 sm:mb-2">Email Us</h2>
            <p className="text-gray-600 text-sm sm:text-base">info@gmail.com</p>
          </div>

          {/* Phone */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 text-center border border-white/20">
            <Phone className="mx-auto text-[#1e9797] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#1e9797] mb-1 sm:mb-2">Call Us</h2>
            <p className="text-gray-600 text-sm sm:text-base">+92 330 1234567</p>
          </div>

          {/* Location */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 text-center border border-white/20 sm:col-span-2 lg:col-span-1">
            <MapPin className="mx-auto text-[#1e9797] w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-[#1e9797] mb-1 sm:mb-2">Visit Us</h2>
            <p className="text-gray-600 text-sm sm:text-base">North Nazimabad, Karachi</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-[#1e9797]/20 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#1e9797] mb-4 sm:mb-5 md:mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2.5 sm:p-3 text-sm sm:text-base rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-2.5 sm:p-3 text-sm sm:text-base rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="p-2.5 sm:p-3 text-sm sm:text-base rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#258181] to-[#9de9e9] font-bold text-sm sm:text-base text-white py-2.5 sm:py-3 rounded-xl hover:opacity-90 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Facebook size={24} className="sm:w-7 sm:h-7 md:w-7 md:h-7" />
          </a>
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Instagram size={24} className="sm:w-7 sm:h-7 md:w-7 md:h-7" />
          </a>
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Twitter size={24} className="sm:w-7 sm:h-7 md:w-7 md:h-7" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;