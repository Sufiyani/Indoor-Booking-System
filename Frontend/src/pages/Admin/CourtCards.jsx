import React from "react";
import { useNavigate } from "react-router-dom";

import cricketImg from "../../assets/CricketImg.jpeg";
import futsalImg from "../../assets/FutsalImg.jpeg";
import padelImg from "../../assets/PadelImg.jpeg";

const GalleryCards = () => {
  const navigate = useNavigate();

  const sports = [
    {
      title: "Cricket",
      image: cricketImg,
      description: "Experience cricket like never before on our premium grounds",
      path: "/admin/view-cricket-booking-page",
    },
    {
      title: "Futsal",
      image: futsalImg,
      description: "Fast-paced action on our state-of-the-art futsal courts",
      path: "/admin/view-futsal-booking-page",
    },
    {
      title: "Padel",
      image: padelImg,
      description: "Discover the thrill of padel on professional courts",
      path: "/admin/view-padel-booking-page",
    },
  ];

  return (
    <div id="gallery" className="py-16 px-6 bg-transparent ml-15 mr-15 mt-15">
      <div className="w-[90%] mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
          Choose Your Game
        </h1>
        <p className="text-white text-lg max-w-3xl mx-auto">
          Premium sports facilities at your fingertips
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sports.map((sport, index) => (
          <div
            key={index}
            className="group relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 hover:-translate-y-2 transition-transform duration-500 border border-white/20 cursor-pointer"
            onClick={() => navigate(sport.path)} // ✅ navigate on card click
          >
            {/* Image */}
            <div className="relative h-72 overflow-hidden rounded-xl">
              <img
                src={sport.image}
                alt={sport.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30"></div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                  {sport.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="mt-4 text-left">
              <p className="text-gray-300 text-base mb-4 leading-relaxed">
                {sport.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent parent click from firing
                  navigate(sport.path);
                }}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-orange-500/50 transition duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryCards;
