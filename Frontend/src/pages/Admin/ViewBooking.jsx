import React, { useEffect, useState } from "react";
import { getAllBookings } from "../../services/bookingService";

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const startHour = i % 12 === 0 ? 12 : i % 12;
    const endHour = (i + 1) % 12 === 0 ? 12 : (i + 1) % 12;
    const startPeriod = i < 12 ? "AM" : "PM";
    const endPeriod = i + 1 < 12 ? "AM" : "PM";
    return `${startHour} ${startPeriod} - ${endHour} ${endPeriod}`;
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingsData = await getAllBookings();
      console.log("Fetched bookings:", bookingsData);
      
      if (bookingsData && Array.isArray(bookingsData) && bookingsData.length > 0) {
        const formattedBookings = bookingsData.map(booking => {
          const sortedSlots = [...(booking.slots || [])].sort((a, b) => a - b);
          
          if (sortedSlots.length === 0) {
            return {
              id: booking._id || booking.id,
              name: booking.name || "N/A",
              email: booking.email || "N/A",
              court: booking.court || "Cricket",
              date: booking.date || 1,
              month: booking.month,
              monthName: months[booking.month] || "Unknown",
              year: booking.year || 2025,
              timeSlots: "No slots",
              paymentMethod: booking.paymentMethod || "Cash",
              paymentStatus: booking.paymentStatus || "Unpaid",
              createdAt: booking.createdAt
            };
          }

          const groupedSlots = [];
          let currentGroup = [sortedSlots[0]];

          for (let i = 1; i < sortedSlots.length; i++) {
            if (sortedSlots[i] === sortedSlots[i - 1] + 1) {
              currentGroup.push(sortedSlots[i]);
            } else {
              groupedSlots.push(currentGroup);
              currentGroup = [sortedSlots[i]];
            }
          }
          groupedSlots.push(currentGroup);

          const bookedTimeSlots = groupedSlots.map(group => {
            const firstSlot = group[0];
            const lastSlot = group[group.length - 1];
            const [startTime] = timeSlots[firstSlot].split(" - ");
            const [, endTime] = timeSlots[lastSlot].split(" - ");
            return `${startTime} - ${endTime}`;
          }).join(", ");

          return {
            id: booking._id || booking.id,
            name: booking.name || "N/A",
            email: booking.email || "N/A",
            court: booking.court || "Cricket",
            date: booking.date || 1,
            month: booking.month,
            monthName: months[booking.month] || "Unknown",
            year: booking.year || 2025,
            timeSlots: bookedTimeSlots,
            paymentMethod: booking.paymentMethod || "Cash",
            paymentStatus: booking.paymentStatus || "Unpaid",
            createdAt: booking.createdAt
          };
        });

        formattedBookings.sort((a, b) => {
          const dateA = new Date(a.year, a.month, a.date);
          const dateB = new Date(b.year, b.month, b.date);
          return dateB - dateA;
        });

        setBookings(formattedBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(`Error loading bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const courtMatch = filter === "all" ? true : booking.court.toLowerCase() === filter.toLowerCase();

    let dateMatch = true;
    if (dateFilter) {
      const selected = new Date(dateFilter);
      const bookingDate = new Date(booking.year, booking.month, booking.date);
      
      dateMatch = (
        selected.getDate() === bookingDate.getDate() &&
        selected.getMonth() === bookingDate.getMonth() &&
        selected.getFullYear() === bookingDate.getFullYear()
      );
    }

    return courtMatch && dateMatch;
  });

  const clearDateFilter = () => {
    setDateFilter("");
  };

  const getCourtColor = (court) => {
    switch (court.toLowerCase()) {
      case "cricket":
        return "text-green-400";
      case "futsal":
        return "text-blue-400";
      case "padel":
        return "text-purple-400";
      default:
        return "text-[#1e9797]";
    }
  };

  const getPaymentMethodColor = (method) => {
    if (!method) return "text-gray-600";
    return method.toLowerCase() === "online"
      ? "text-blue-400"
      : "text-yellow-400";
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return "bg-gray-500/20 text-gray-600 border-gray-500/50";
    return status.toLowerCase() === "paid" 
      ? "bg-green-500/20 text-green-400 border-green-500/50"
      : "bg-red-500/20 text-red-400 border-red-500/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-[#1e9797] mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-[#1e9797] font-semibold">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-red-50 p-6 sm:p-8 rounded-2xl border border-red-200 max-w-md w-full">
          <p className="text-red-600 text-lg sm:text-xl mb-4 font-semibold">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-gradient-to-r from-[#1a6868] to-[#89cfcf] hover:opacity-90 px-6 py-2 rounded-lg transition text-white font-semibold w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#258181] to-[#8cd3d3] bg-clip-text text-transparent mb-2 sm:mb-3">
            All Bookings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            View and manage all court reservations
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
          
          {/* Date Filter */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <label htmlFor="dateFilter" className="text-[#1e9797] font-semibold text-sm sm:text-base text-center sm:text-left">
              Filter by Date:
            </label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-white text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base w-full sm:w-auto"
            />
            {dateFilter && (
              <button
                onClick={clearDateFilter}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 rounded-lg transition font-semibold text-white text-sm sm:text-base w-full sm:w-auto"
              >
                Clear Date
              </button>
            )}
          </div>

          {/* Court Filter Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-xs sm:text-base ${
                filter === "all"
                  ? "bg-gradient-to-r from-[#1a6868] to-[#89cfcf] text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("cricket")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-xs sm:text-base ${
                filter === "cricket"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              Cricket ({bookings.filter(b => b.court.toLowerCase() === "cricket").length})
            </button>
            <button
              onClick={() => setFilter("futsal")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-xs sm:text-base ${
                filter === "futsal"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              Futsal ({bookings.filter(b => b.court.toLowerCase() === "futsal").length})
            </button>
            <button
              onClick={() => setFilter("padel")}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-xs sm:text-base ${
                filter === "padel"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              Padel ({bookings.filter(b => b.court.toLowerCase() === "padel").length})
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filter !== "all" || dateFilter) && (
          <div className="mb-4 sm:mb-6 text-center">
            <p className="text-[#1e9797] font-medium text-sm sm:text-base lg:text-lg">
              Showing {filteredBookings.length} booking(s)
              {filter !== "all" && ` for ${filter}`}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center text-lg mt-8 sm:mt-12 bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/20">
            <p className="text-gray-600 text-base sm:text-xl">
              No bookings found
              {filter !== "all" && ` for ${filter}`}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString()}`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-2xl bg-[#1e9797]/10 backdrop-blur-xl border border-white/20">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1a6868] to-[#89cfcf]">
                    <th className="py-4 px-4 text-left font-bold text-white">Customer Name</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Email</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Court Type</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Date</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Time Slots</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Payment Method</th>
                    <th className="py-4 px-4 text-center font-bold text-white">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white/80">
                  {filteredBookings.map((booking, index) => (
                    <tr 
                      key={booking.id || index} 
                      className="hover:bg-[#1e9797]/20 transition duration-200 border-b border-[#1e9797]/20"
                    >
                      <td className="py-3 px-4 font-semibold text-gray-800">{booking.name}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.email}</td>
                      <td className={`py-3 px-4 font-bold ${getCourtColor(booking.court)}`}>
                        {booking.court}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {booking.date} {booking.monthName}, {booking.year}
                      </td>
                      <td className="py-3 px-4 text-orange-500 font-semibold">
                        {booking.timeSlots}
                      </td>
                      <td className={`py-3 px-4 font-semibold ${getPaymentMethodColor(booking.paymentMethod)}`}>
                        {booking.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border-2 ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.map((booking, index) => (
                <div 
                  key={booking.id || index}
                  className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg border border-[#1e9797]/20 p-4 sm:p-5 hover:shadow-xl transition duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">{booking.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm break-all">{booking.email}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ml-2 ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Court Type</p>
                      <p className={`font-bold text-sm sm:text-base ${getCourtColor(booking.court)}`}>
                        {booking.court}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-gray-700 font-medium text-sm sm:text-base">
                        {booking.date} {booking.monthName}, {booking.year}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Time Slots</p>
                    <p className="text-orange-500 font-semibold text-sm sm:text-base">
                      {booking.timeSlots}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                      <p className={`font-semibold text-sm ${getPaymentMethodColor(booking.paymentMethod)}`}>
                        {booking.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary Stats */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Total Bookings</p>
            <p className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-[#1a6868] to-[#89cfcf] bg-clip-text text-transparent">
              {filteredBookings.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-green-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Paid</p>
            <p className="text-2xl sm:text-4xl font-bold text-green-600">
              {filteredBookings.filter(b => b.paymentStatus && b.paymentStatus.toLowerCase() === "paid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-red-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Unpaid</p>
            <p className="text-2xl sm:text-4xl font-bold text-red-600">
              {filteredBookings.filter(b => b.paymentStatus && b.paymentStatus.toLowerCase() === "unpaid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-blue-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Online Payments</p>
            <p className="text-2xl sm:text-4xl font-bold text-blue-600">
              {filteredBookings.filter(b => b.paymentMethod && b.paymentMethod.toLowerCase() === "online").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;