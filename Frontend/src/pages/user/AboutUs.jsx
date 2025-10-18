import React from "react";

const AboutUs = () => {
    return (
        <div id="about us" className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-transparent">
            <div className="w-full sm:w-[95%] md:w-[90%] mx-auto text-center">
                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1a6868] to-[#9de9e9] bg-clip-text text-transparent mb-4 sm:mb-5 md:mb-6 px-2">
                    About Us
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl md:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2">
                    Indoor Management System was established in{" "}
                    <span className="font-semibold text-gray-400">August 2023 </span>
                    in North Nazimabad, Karachi. Our goal is to provide a modern and seamless way for sports enthusiasts
                    to manage bookings, explore indoor games, and enjoy premium facilities under one roof.
                    Since our launch, we have been committed to creating a hub where players of all ages can connect,
                    compete, and grow together. By combining technology with top-class infrastructure,
                    we make sure every visitor experiences convenience, energy, and a passion for sports like never before.
                </p>


                {/* Content Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 text-left">
                    {/* Mission */}
                    <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 hover:-translate-y-2 transition-transform duration-500 border border-white/20">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#1e9797] mb-2 sm:mb-3">Our Mission</h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            Our mission is to revolutionize the indoor games industry by
                            blending innovation with accessibility. We strive to create a platform
                            where booking courts and managing schedules is as simple as a few clicks.
                            Beyond convenience, we aim to inspire a culture of active living by
                            providing reliable, premium, and technology-driven sports facilities
                            that encourage people of all ages to play, engage, and excel.
                        </p>
                    </div>

                    {/* Role */}
                    <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 hover:-translate-y-2 transition-transform duration-500 border border-white/20">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#1e9797] mb-2 sm:mb-3">Our Role</h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            We see ourselves as a bridge between passionate players and modern
                            indoor facilities. By connecting communities with state-of-the-art
                            cricket pitches, futsal arenas, and padel courts, we simplify access
                            to quality sports venues under one system. Our role extends beyond
                            bookings—we build trust, ensure fair play, and foster a supportive
                            environment where athletes, hobbyists, and families can all
                            experience the joy of indoor sports.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 hover:-translate-y-2 transition-transform duration-500 border border-white/20 sm:col-span-2 lg:col-span-1">
                        <h2 className="text-xl sm:text-2xl font-semibold text-[#1e9797] mb-2 sm:mb-3">Our Vision</h2>
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                            Our vision is to become a leading force in the indoor games industry,
                            recognized for setting new standards in convenience, quality, and
                            community engagement. We aspire to build a thriving ecosystem where
                            technology enhances sports experiences, making Karachi—and eventually
                            Pakistan—a hub for modern indoor sports. By cultivating inclusivity,
                            innovation, and passion, we aim to inspire the next generation of
                            athletes and sports lovers alike.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;