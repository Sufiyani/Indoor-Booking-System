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
      path: "/cricket-ground",
    },
    {
      title: "Futsal",
      image: futsalImg,
      description: "Fast-paced action on our state-of-the-art futsal courts",
      path: "/futsal-ground",
    },
    {
      title: "Padel",
      image: padelImg,
      description: "Discover the thrill of padel on professional courts",
      path: "/padel-ground",
    },
  ];

  return (
    <div id="gallery" className="py-16 px-6 bg-transparent ml-15 mr-15">
      <div className="w-[90%] mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#258181] to-[#9de9e9] bg-clip-text text-transparent mb-3">
          Choose Your Game
        </h1>

        <p className="text-gray-600 font-semibold text-lg max-w-3xl mx-auto">
          Premium sports facilities at your fingertips
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sports.map((sport, index) => (
          <div
            key={index}
            className="group relative bg-[#1e9797]/20 backdrop-blur-xl rounded-2xl shadow-xl p-4 hover:-translate-y-2 transition-transform duration-500 border border-white/20 cursor-pointer"
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
                <h2 className="text-3xl font-bold text-[#FFFDEB] drop-shadow-lg">
                  {sport.title}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="mt-4 text-left">
              <p className="text-gray-600 font-semibold text-base mb-4 leading-relaxed">
                {sport.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent parent click from firing
                  navigate(sport.path);
                }}
                className="w-full bg-gradient-to-r from-[#258181] to-[#9de9e9] text-white font-bold font-sans px-4 py-2 rounded-xl shadow-lg hover:shadow-[#1e9797]/50 transition duration-300"
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