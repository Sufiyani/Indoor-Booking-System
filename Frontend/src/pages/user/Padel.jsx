import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

const Padel = () => {
  const navigate = useNavigate();

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
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const slotsRef = useRef(null);

  // ✅ Fetch booked slots for Padel
  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const data = await bookingService.getAll();
        const grouped = {};

        data
          .filter((b) => b.court === "Padel")
          .forEach((b) => {
            const key = `${b.year}-${b.month}-${b.date}`;
            grouped[key] = grouped[key]
              ? [...grouped[key], ...b.slots]
              : [...b.slots];
          });

        setBookedSlots(grouped);
      } catch (error) {
        console.error("Error fetching padel bookings:", error);
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

  // ✅ Save booking to localStorage and navigate
  const handleBookNow = () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    const bookingData = {
      year: selectedYear,
      month: selectedMonth,
      date: selectedDate,
      slots: selectedSlots,
      court: "Padel",
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
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full bg-gray-900 p-4 md:p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Select Year</h2>
        <div className="flex flex-wrap gap-3 mb-6 justify-center md:justify-start">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setSelectedDate(null);
                setSelectedSlots([]);
              }}
              className={`px-4 py-2 rounded-lg transition ${
                selectedYear === year
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "bg-gray-700 hover:bg-gray-600"
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
              className={`cursor-pointer px-3 py-2 rounded-lg transition ${
                selectedMonth === index
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {month}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 w-full p-4 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Padel Court Booking
        </h1>
        <p className="text-sm sm:text-base text-gray-400 text-center mb-6">
          Book your favorite time slots for padel. Select up to 3 slots at once.
        </p>

        {isLoading && (
          <div className="text-center text-blue-400 mb-4">
            Loading bookings...
          </div>
        )}

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-blue-400 text-xs sm:text-sm">{day}</div>
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
                  ${day ? "bg-gray-800 hover:bg-blue-600 cursor-pointer" : ""}
                  ${selectedDate === day ? "bg-blue-600 font-bold" : ""}`}
              >
                {day || ""}
              </div>
            ))
          )}
        </div>

        {/* Slots Section */}
        {selectedDate && (
          <div ref={slotsRef} className="w-full mt-6">
            <h2 className="text-xl font-bold text-center mb-4 text-blue-400">
              {months[selectedMonth]} {selectedDate}, {selectedYear}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Time Slots */}
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[500px]">
                <h3 className="text-lg font-bold mb-3 text-center sm:text-left sticky top-0 bg-gray-900 pb-2">
                  Time Slots
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {timeSlots.map((slot, index) => (
                    <li key={index} className="h-10 px-3 py-2 rounded bg-gray-800 flex items-center">
                      {slot}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Available Slots */}
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[500px]">
                <h3 className="text-lg font-bold mb-3 text-center sm:text-left sticky top-0 bg-gray-900 pb-2">
                  Available Slots
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {Array(24).fill(null).map((_, index) => (
                    <li
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`h-10 flex items-center justify-center rounded transition cursor-pointer
                      ${selectedSlots.includes(index) 
                        ? "bg-blue-600 text-white font-bold scale-105" 
                        : bookedForDate.includes(index)
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : "bg-gray-800 hover:bg-blue-600 hover:scale-105"
                      }`}
                    >
                      {selectedSlots.includes(index) ? (
                        <span className="text-2xl">🎾</span>
                      ) : bookedForDate.includes(index) ? (
                        <span className="text-2xl opacity-50">🎾</span>
                      ) : (
                        <span className="text-gray-500">Click to book</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booked Slots */}
              <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[500px]">
                <h3 className="text-lg font-bold mb-3 text-center sm:text-left sticky top-0 bg-gray-900 pb-2">
                  Confirmed Bookings
                </h3>
                <ul className="space-y-1 text-xs sm:text-sm">
                  {Array(24).fill(null).map((_, index) => (
                    <li
                      key={index}
                      className={`h-10 flex items-center justify-center rounded cursor-not-allowed
                      ${bookedForDate.includes(index) 
                        ? "bg-blue-900 text-white font-bold" 
                        : "bg-gray-800"
                      }`}
                    >
                      {bookedForDate.includes(index) && (
                        <span className="text-2xl">🎾</span>
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
            <p className="text-blue-400 font-semibold">
              {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => setShowConfirmPopup(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Popups */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-blue-400">Limit Reached</h2>
            <p>You can only book up to 3 slots.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-5 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {showBookedPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-blue-400">Slot Already Booked</h2>
            <p>This slot is not available. Please choose another one.</p>
            <button
              onClick={() => setShowBookedPopup(false)}
              className="mt-5 px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Popup */}
      {showConfirmPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-blue-400">Confirm Booking</h2>
            <p>Are you sure you want to book these slots?</p>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => {
                  setShowConfirmPopup(false);
                  handleBookNow();
                }}
                className="px-5 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-5 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
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

export default Padel;
