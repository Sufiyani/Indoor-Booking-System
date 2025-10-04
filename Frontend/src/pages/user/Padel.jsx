import React, { useState, useRef, useEffect } from "react";

const Padel = () => {
  const years = [2023, 2024, 2025];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showBookedPopup, setShowBookedPopup] = useState(false);

  const slotsRef = useRef(null);

  // Load booked slots from localStorage
  useEffect(() => {
    const savedSlots = JSON.parse(localStorage.getItem("padelBookedSlots")) || {};
    setBookedSlots(savedSlots);
  }, []);

  // Scroll to slots section when date is selected
  useEffect(() => {
    if (selectedDate && slotsRef.current) {
      slotsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDate]);

  const handleSlotClick = (index) => {
    const key = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    const bookedForDate = bookedSlots[key] || [];

    if (bookedForDate.includes(index)) {
      setShowBookedPopup(true);
      return;
    }

    if (selectedSlots.includes(index)) {
      setSelectedSlots(selectedSlots.filter((slot) => slot !== index));
    } else {
      if (selectedSlots.length >= 4) {
        setShowPopup(true);
        return;
      }
      setSelectedSlots([...selectedSlots, index]);
    }
  };

  const handleBooking = () => {
    const key = `${selectedYear}-${selectedMonth}-${selectedDate}`;
    const bookedForDate = bookedSlots[key] || [];
    const updatedBooked = { 
      ...bookedSlots, 
      [key]: [...bookedForDate, ...selectedSlots] 
    };
    setBookedSlots(updatedBooked);
    localStorage.setItem("padelBookedSlots", JSON.stringify(updatedBooked));
    setSelectedSlots([]);
    alert(`You booked ${selectedSlots.length} slot(s)`);
  };

  const generateCalendar = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];
    let week = [];

    for (let i = 0; i < firstDay; i++) week.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null);
      calendar.push(week);
    }
    return calendar;
  };

  const calendar = generateCalendar(selectedYear, selectedMonth);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const start = i % 12 === 0 ? 12 : i % 12;
    const end = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
    const ampmStart = i < 12 ? "AM" : "PM";
    const ampmEnd = i + 1 < 12 ? "AM" : "PM";
    return `${start} ${ampmStart} - ${end} ${ampmEnd}`;
  });

  const key = `${selectedYear}-${selectedMonth}-${selectedDate}`;
  const bookedForDate = bookedSlots[key] || [];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-gray-900 p-4 md:p-6 border-r md:border-gray-700">
        <h2 className="text-2xl font-bold mb-4 mt-4 md:mt-18 text-center md:text-left">Select Year</h2>
        <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => { setSelectedYear(year); setSelectedDate(null); }}
              className={`px-4 py-2 rounded-lg ${selectedYear === year ? "bg-gradient-to-r from-orange-600 to-red-600" : "bg-gray-700"}`}
            >
              {year}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-3 text-center md:text-left">Months</h2>
        <ul className="space-y-2 flex flex-wrap gap-2 justify-center md:block">
          {months.map((month, index) => (
            <li
              key={index}
              onClick={() => { setSelectedMonth(index); setSelectedDate(null); }}
              className={`cursor-pointer px-3 py-2 rounded-lg ${selectedMonth === index ? "bg-orange-600 text-white" : "hover:bg-gray-700"}`}
            >
              {month}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 w-full p-4 md:p-8">
        <h1 className="mt-4 md:mt-15 text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6 text-center">
          Padel Gallery
        </h1>

        <p className="text-sm sm:text-lg text-white max-w-2xl text-center mx-auto mb-6 sm:mb-10">
          Padel is a rapidly growing racket sport played on an enclosed court,
          combining elements of tennis and squash. Explore intense matches, top players, and tournament highlights.
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          {months[selectedMonth]} {selectedYear}
        </h2>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center overflow-auto">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-orange-400 text-xs sm:text-sm">{day}</div>
          ))}
          {calendar.map((week, i) =>
            week.map((day, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => day && setSelectedDate(day)}
                className={`h-10 sm:h-14 flex items-center justify-center rounded-lg text-xs sm:text-sm
                  ${day ? "bg-gray-800 hover:bg-orange-600 cursor-pointer" : ""} 
                  ${selectedDate === day ? "bg-black" : ""}`}
              >
                {day || ""}
              </div>
            ))
          )}
        </div>

        {/* Slots Section */}
        {selectedDate && (
          <div ref={slotsRef} className="w-full mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Time Slots */}
            <div className="bg-gray-900 p-4 rounded-lg overflow-auto h-full">
              <h3 className="text-lg font-bold mb-2 text-center sm:text-left">
                Time Slots - {months[selectedMonth]} {selectedDate}, {selectedYear}
              </h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                {timeSlots.map((slot, index) => (
                  <li key={index} className="h-8 sm:h-10 px-2 sm:px-3 py-1 rounded bg-gray-800 hover:bg-orange-600 cursor-pointer">
                    {slot}
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Slots */}
            <div className="bg-gray-900 p-4 rounded-lg overflow-auto h-full">
              <h3 className="text-lg font-bold mb-2 text-center sm:text-left">Available Slots</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                {Array(24).fill(null).map((_, index) => (
                  <li
                    key={index}
                    onClick={() => handleSlotClick(index)}
                    className={`h-8 sm:h-10 flex items-center justify-center rounded bg-gray-800 cursor-pointer ${selectedSlots.includes(index) ? "bg-orange-600 text-white font-bold" : "hover:bg-orange-600"} ${bookedForDate.includes(index) ? "bg-gray-700 cursor-not-allowed" : ""}`}
                  >
                    {selectedSlots.includes(index) || bookedForDate.includes(index) ? <span className="text-sm sm:text-2xl">🎾</span> : ""}
                  </li>
                ))}
              </ul>
            </div>

            {/* Booked Slots */}
            <div className="bg-gray-900 p-4 rounded-lg overflow-auto h-full">
              <h3 className="text-lg font-bold mb-2 text-center sm:text-left">Booked Slots</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                {Array(24).fill(null).map((_, index) => (
                  <li
                    key={index}
                    className={`h-8 sm:h-10 flex items-center justify-center rounded bg-gray-800 cursor-not-allowed ${bookedForDate.includes(index) ? "bg-orange-600 text-white font-bold" : ""}`}
                  >
                    {bookedForDate.includes(index) ? <span className="text-sm sm:text-2xl">🎾</span> : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        {selectedSlots.length > 0 && (
          <div className="mt-4 sm:mt-6 text-center sm:text-end">
            <button
              onClick={handleBooking}
              className="px-6 py-2 sm:px-6 sm:py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Popups */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[300px]">
            <h2 className="text-lg font-bold text-red-500 mb-4">⚠️ Limit Reached</h2>
            <p>You can't book more than 4 slots with 1 payment.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-orange-600 rounded hover:bg-orange-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showBookedPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[300px]">
            <h2 className="text-lg font-bold text-red-500 mb-4">⚠️ Already Booked</h2>
            <p>This slot is already booked.</p>
            <button
              onClick={() => setShowBookedPopup(false)}
              className="mt-4 px-4 py-2 bg-orange-600 rounded hover:bg-orange-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Padel;
