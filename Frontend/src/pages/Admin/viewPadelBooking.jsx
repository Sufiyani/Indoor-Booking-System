import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewPadelBooking = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const bookedData = JSON.parse(localStorage.getItem("padelBookedSlots")) || {};
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const allBookings = [];

    Object.keys(bookedData).forEach((key) => {
      const [year, month, date] = key.split("-").map(Number);
      const slots = bookedData[key];

      slots.forEach((slotIndex) => {
        const start = slotIndex % 12 === 0 ? 12 : slotIndex % 12;
        const end = (slotIndex + 1) % 12 === 0 ? 12 : (slotIndex + 1) % 12;
        const ampmStart = slotIndex < 12 ? "AM" : "PM";
        const ampmEnd = slotIndex + 1 < 12 ? "AM" : "PM";
        const time = `${start} ${ampmStart} - ${end} ${ampmEnd}`;

        allBookings.push({
          date,
          month: months[month],
          year,
          time
        });
      });
    });

    // Sort bookings by date
    allBookings.sort(
      (a, b) =>
        new Date(a.year, months.indexOf(a.month), a.date) -
        new Date(b.year, months.indexOf(b.month), b.date)
    );

    setBookings(allBookings);
  }, []);

  return (
    <div id="view-padel-page" className="min-h-screen bg-black text-white p-10 mt-15">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
        All Booked Padel Slots
      </h1>
      
      {bookings.length === 0 ? (
        <p className="text-center text-lg mt-8">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-900">
                <th className="py-3 px-6 border-b border-gray-700">Date</th>
                <th className="py-3 px-6 border-b border-gray-700">Month</th>
                <th className="py-3 px-6 border-b border-gray-700">Year</th>
                <th className="py-3 px-6 border-b border-gray-700">Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index} className="hover:bg-gray-800">
                  <td className="py-2 px-6 border-b border-gray-700 text-center">{booking.date}</td>
                  <td className="py-2 px-6 border-b border-gray-700 text-center">{booking.month}</td>
                  <td className="py-2 px-6 border-b border-gray-700 text-center">{booking.year}</td>
                  <td className="py-2 px-6 border-b border-gray-700 text-center">{booking.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPadelBooking;
