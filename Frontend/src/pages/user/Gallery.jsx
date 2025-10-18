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
    <div id="gallery" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-transparent">
      <div className="w-full sm:w-[95%] md:w-[90%] mx-auto text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#258181] to-[#9de9e9] bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
          Choose Your Game
        </h1>
        <p className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl md:max-w-3xl mx-auto px-2">
          Premium sports facilities at your fingertips
        </p>
      </div>
      
      <div className="w-full sm:w-[95%] md:w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {sports.map((sport, index) => (
          <div
            key={index}
            className="group relative bg-[#1e9797]/20 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 hover:-translate-y-2 transition-transform duration-500 border border-white/20 cursor-pointer"
            onClick={() => navigate(sport.path)}
          >
            {/* Image */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-lg sm:rounded-xl">
              <img
                src={sport.image}
                alt={sport.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              {/* Title overlay */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-[#FFFDEB] drop-shadow-lg">
                  {sport.title}
                </h2>
              </div>
            </div>
            
            {/* Content */}
            <div className="mt-3 sm:mt-4 text-left">
              <p className="text-gray-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                {sport.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(sport.path);
                }}
                className="w-full bg-gradient-to-r from-[#258181] to-[#9de9e9] text-white font-bold font-sans px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-[#1e9797]/50 transition duration-300"
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