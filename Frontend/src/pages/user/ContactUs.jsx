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
    const phoneNumber = "923303253692"; // WhatsApp number (Pakistan code without +)
    const whatsappMessage = `Hello, my name is *${name}*.\nMy email is *${email}*.\n\nMessage:\n${message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div id="contact us" className="py-16 px-6 bg-transparent">
      <div className="w-[90%] mx-auto text-center">
        {/* Heading */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1a6868] to-[#9de9e9] bg-clip-text text-transparent mb-6">
          Contact Us
        </h1>
        <p className="text-white text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          Have questions, suggestions, or want to book with us? We’d love to hear
          from you. Reach out through the details below or send us a quick message
          using the contact form.
        </p>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
          {/* Email */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20">
            <Mail className="mx-auto text-[#1e9797] w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold text-[#1e9797] mb-2">Email Us</h2>
            <p className="text-gray-600">info@gmail.com</p>
          </div>

          {/* Phone */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20">
            <Phone className="mx-auto text-[#1e9797] w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold text-[#1e9797] mb-2">Call Us</h2>
            <p className="text-gray-600">+92 330 1234567</p>
          </div>

          {/* Location */}
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 text-center border border-white/20">
            <MapPin className="mx-auto text-[#1e9797] w-10 h-10 mb-4" />
            <h2 className="text-xl font-semibold text-[#1e9797] mb-2">Visit Us</h2>
            <p className="text-gray-600">North Nazimabad, Karachi</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-[#1e9797]/20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#1e9797] mb-6 text-center">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-3 rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="p-3 rounded-xl bg-[#1e9797]/20 text-gray-800 placeholder-gray-400 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
            ></textarea>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#258181] to-[#9de9e9] font-bold text-white py-3 rounded-xl hover:opacity-90 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Facebook size={28} />
          </a>
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Instagram size={28} />
          </a>
          <a href="#" className="text-[#1e9797] hover:text-[#087e7e] transition">
            <Twitter size={28} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;