import React from "react";
import { useNavigate } from "react-router-dom";

const FutsalGround = () => {
  const navigate = useNavigate();

  // Sample image URLs (replace with actual URLs)
  const courtImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNAq7t0EIW6zAkJjQQmfj1dvEbprA-NDo4MA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNAq7t0EIW6zAkJjQQmfj1dvEbprA-NDo4MA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNAq7t0EIW6zAkJjQQmfj1dvEbprA-NDo4MA&s",
  ];

  return (
    <div id="futsal-ground" className="py-16 px-6 bg-transparent mt-15">
      <div className="w-[90%] mx-auto text-center">
        {/* Heading */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-8">
          Futsal Court Gallery
        </h1>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {courtImages.map((url, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-2 border border-white/20"
            >
              <img
                src={url}
                alt={`Futsal Court ${index + 1}`}
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>

        {/* Book Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/futsal")}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-orange-500/50 transition duration-300"
          >
            Book Futsal Court Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FutsalGround;
