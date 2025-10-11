import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

const Cricket = () => {
  const navigate = useNavigate();

  const years = [2025,2026,2027];
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
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // ✅ Confirmation popup
  const [isLoading, setIsLoading] = useState(true);

  const slotsRef = useRef(null);

  // ✅ Fetch booked slots from backend
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const data = await bookingService.getAll();
        const grouped = {};

        data
          .filter((b) => b.court === "Cricket")
          .forEach((b) => {
            const key = `${b.year}-${b.month}-${b.date}`;
            grouped[key] = grouped[key]
              ? [...grouped[key], ...b.slots]
              : [...b.slots];
          });

        setBookedSlots(grouped);
      } catch (error) {
        console.error("Error fetching cricket bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
      if (selectedSlots.length >= 3) {
        setShowPopup(true);
        return;
      }
      setSelectedSlots([...selectedSlots, index]);
    }
  };

  // ✅ Save booking to localStorage and navigate to payment page
  const handleBookNow = () => {
    const bookingData = {
      year: selectedYear,
      month: selectedMonth,
      date: selectedDate,
      slots: selectedSlots,
      court: "Cricket",
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    navigate("/payment-method");
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
    <div className="min-h-screen bg-[#FFFDEB] text-white flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-[#1e9797]/10 text-gray-600 font-bold p-4 md:p-6 border-r border-[#1e9797]">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left mt-15 bg-gradient-to-r from-[#1a6868] to-[#9de9e9] bg-clip-text text-transparent">
          Select Year
        </h2>

        <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedDate(null);
                setSelectedSlots([]);
              }}
              className={`px-4 py-2 rounded-lg transition ${selectedYear === year
                ? "bg-gradient-to-r from-[#258181] to-[#8cd3d3]"
                : "bg-[#1e9797]/20 hover:bg-[#087e7e]"
                }`}
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
              onClick={() => {
                setSelectedMonth(index);
                setSelectedDate(null);
                setSelectedSlots([]);
              }}
              className={`cursor-pointer px-3 py-2 rounded-lg transition ${selectedMonth === index
                ? "bg-gradient-to-r from-[#258181] to-[#8cd3d3] text-white"
                : "hover:bg-[#087e7e]"
                }`}
            >
              {month}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 w-full p-4 md:p-8 mt-15">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-[#258181] to-[#8cd3d3] bg-clip-text text-transparent">
          Cricket Ground Booking
        </h1>
        <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
          Book your favorite time slots for indoor cricket. Select up to 3 slots at once.
        </p>

        {isLoading && (
          <div className="text-center text-[#1e9797] mb-4">
            Loading bookings...
          </div>
        )}

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-[#1e9797] text-xs sm:text-sm">{day}</div>
          ))}
          {calendar.map((week, i) =>
            week.map((day, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  if (day) {
                    setSelectedDate(day);
                    setSelectedSlots([]);
                  }
                }}
                className={`h-10 sm:h-14 flex items-center justify-center rounded-lg text-xs sm:text-sm transition
                  ${day ? "bg-[#1e9797]/10 text-gray-800 hover:bg-[#179c9c] cursor-pointer" : ""}
                  ${selectedDate === day ? "font-bold" : ""}`}
              >
                {day || ""}
              </div>
            ))
          )}
        </div>

        {/* Slots Section */}
        {selectedDate && (
          <div ref={slotsRef} className="w-full mt-6">
            <h2 className="text-xl font-bold text-center mb-4 text-[#1e9797]">
              {months[selectedMonth]} {selectedDate}, {selectedYear}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Time Slots */}
              <div className="bg-[#1e9797]/10 p-4 rounded-lg overflow-auto max-h-full">
                <h3 className="text-lg font-bold mb-3 flex items-center justify-center sticky top-0 bg-[#1e9797]/30 h-14 rounded text-[#1e9797]">
                  Time Slots
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {timeSlots.map((slot, index) => (
                    <li key={index} className="h-10 px-3 py-2 rounded bg-[#1e9797]/30 flex items-center">
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Slots */}
              <div className="bg-[#1e9797]/10 p-4 rounded-lg overflow-auto max-h-full">
                <h3 className="text-lg font-bold mb-3 flex items-center justify-center sticky top-0 bg-[#1e9797]/30 h-14 rounded text-[#1e9797]">
                  Available Slots
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {Array(24).fill(null).map((_, index) => (
                    <li
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`h-10 flex items-center justify-center rounded transition cursor-pointer
                      ${selectedSlots.includes(index)
                          ? "bg-[#1a6868] text-white font-bold scale-105"
                          : bookedForDate.includes(index)
                            ? "bg-[#1e9797]/30 cursor-not-allowed opacity-50"
                            : "bg-[#1e9797]/30 hover:bg-[#53c7c7] hover:scale-105"
                        }`}
                    >
                      {selectedSlots.includes(index) ? (
                        <span className="text-2xl">🏏</span>
                      ) : bookedForDate.includes(index) ? (
                        <span className="text-2xl opacity-50">🏏</span>
                      ) : (
                        <span className="text-gray-500">Click to book</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booked Slots */}
              <div className="bg-[#1e9797]/10 p-4 rounded-lg overflow-auto max-h-full">
                <h3 className="text-lg font-bold mb-3 flex items-center justify-center sticky top-0 bg-[#1e9797]/30 h-14 rounded text-[#1e9797]">
                  Confirmed Booking
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {Array(24).fill(null).map((_, index) => (
                    <li
                      key={index}
                      className={`h-10 flex items-center justify-center rounded cursor-not-allowed
                      ${bookedForDate.includes(index)
                          ? "bg-[#1e9797] text-white font-bold"
                          : "bg-[#1e9797]/30"
                        }`}
                    >
                      {bookedForDate.includes(index) && (
                        <span className="text-2xl">🏏</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Book Now Button */}
        {selectedSlots.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-[#1a6868] font-semibold">
              {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => setShowConfirmPopup(true)}
              className="px-8 py-3 bg-gradient-to-r from-[#1a6868] to-[#9de9e9] hover:bg-[#087e7e] rounded-lg font-semibold transition transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* ⚠️ Slot Limit Popup */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1e9797]/70 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-white">Limit Reached</h2>
            <p>You can only book up to 3 slots in one payment.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 px-6 py-2 bg-green-600 rounded hover:bg-[#109116] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ Already Booked Popup */}
      {showBookedPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1e9797]/70 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-white">Slot Already Booked</h2>
            <p>This slot is not available. Please choose another one.</p>
            <button
              onClick={() => setShowBookedPopup(false)}
              className="mt-5 px-6 py-2 bg-green-600 rounded hover:bg-[#109116] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Popup */}
      {showConfirmPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-[#1e9797]/70 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-white">Confirm Booking</h2>
            <p>Are you sure you want to book these slots?</p>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => {
                  setShowConfirmPopup(false);
                  handleBookNow(); // ✅ Now this saves data & redirects
                }}
                className="px-5 py-2 bg-green-600 rounded hover:bg-[#109116] transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-5 py-2 bg-red-800 rounded hover:bg-[#a52424] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cricket;