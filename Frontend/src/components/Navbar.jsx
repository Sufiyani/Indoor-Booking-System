import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const navItems = ["Gallery", "About Us", "Contact Us"];

  return (
    <nav
      className="w-[90%] mx-auto fixed top-0 left-0 right-0 
z-50 flex items-center justify-between px-4 sm:px-6 py-4 
bg-white/10 backdrop-blur-xl rounded-b-3xl border border-white/20 shadow-2xl
"
    >
      {/* Logo */}
      <div
        className="text-xl sm:text-2xl md:text-3xl 
        font-bold tracking-wide 
        text-white 
        drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] 
        italic select-none"
      >
        Indoor Management System
      </div>

      {/* Menu Icon */}
      <div
        className="text-white text-3xl cursor-pointer md:hidden hover:text-white transition-colors"
        onClick={toggleMenu}
      >
        {isOpen ? "✘" : "☰"}
      </div>

      {/* Nav Links */}
      <ul
        className={`flex flex-col items-center justify-center
        md:flex-row md:items-center md:justify-start
        md:static absolute 
        ${isOpen ? "bg-gray-900/95" : "md:bg-transparent bg-transparent"}
        text-white
        top-[72px] left-0 w-full md:w-auto
        transition-all duration-300 ease-in-out
        md:rounded-none rounded-2xl md:border-0 border border-white/10
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
    ${activeIndex === index ? "text-white" : "text-gray-200"}
    hover:text-white
  `}
              onClick={() => setIsOpen(false)}
            >
              {item}
              <span
                className={`absolute bottom-0 left-0 h-0.5 
      bg-white transition-all duration-300
      ${activeIndex === index ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
