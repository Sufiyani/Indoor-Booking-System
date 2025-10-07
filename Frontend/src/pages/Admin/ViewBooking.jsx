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

  // ==================== FILTER LOGIC HERE ====================
  const filteredBookings = bookings.filter(booking => {
    // Court type filter
    const courtMatch = filter === "all" ? true : booking.court.toLowerCase() === filter.toLowerCase();

    // Date filter
    let dateMatch = true;
    if (dateFilter) {
      const selected = new Date(dateFilter);
      const bookingDate = new Date(booking.year, booking.month, booking.date);
      
      dateMatch = (
        selected.getDate() === bookingDate.getDate() &&
        selected.getMonth() === bookingDate.getMonth() &&
        selected.getFullYear() === bookingDate.getFullYear()
      );
      
      console.log('Date Filter Check:', {
        selected: selected.toDateString(),
        booking: bookingDate.toDateString(),
        match: dateMatch
      });
    }

    return courtMatch && dateMatch;
  });
  // ==================== END FILTER LOGIC ====================

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
        return "text-gray-400";
    }
  };

  const getPaymentMethodColor = (method) => {
    if (!method) return "text-gray-400";
    return method.toLowerCase() === "online"
      ? "text-blue-400"
      : "text-yellow-400";
  };

  const getPaymentStatusColor = (status) => {
    if (!status) return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    return status.toLowerCase() === "paid" 
      ? "bg-green-500/20 text-green-400 border-green-500/50"
      : "bg-red-500/20 text-red-400 border-red-500/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          All Bookings - Admin Panel
        </h1>

        {/* Date Filter */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="dateFilter" className="text-gray-300 font-medium">
              Filter by Date:
            </label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {dateFilter && (
              <button
                onClick={clearDateFilter}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        {/* Court Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "all"
                ? "bg-gradient-to-r from-orange-600 to-red-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All Courts ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("cricket")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "cricket"
                ? "bg-green-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Cricket ({bookings.filter(b => b.court.toLowerCase() === "cricket").length})
          </button>
          <button
            onClick={() => setFilter("futsal")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "futsal"
                ? "bg-blue-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Futsal ({bookings.filter(b => b.court.toLowerCase() === "futsal").length})
          </button>
          <button
            onClick={() => setFilter("padel")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "padel"
                ? "bg-purple-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Padel ({bookings.filter(b => b.court.toLowerCase() === "padel").length})
          </button>
        </div>

        {/* Active Filters Display */}
        {(filter !== "all" || dateFilter) && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              Showing {filteredBookings.length} booking(s)
              {filter !== "all" && ` for ${filter}`}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center text-lg mt-12 bg-gray-900 rounded-lg p-8">
            <p className="text-gray-400">
              No bookings found
              {filter !== "all" && ` for ${filter}`}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString()}`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-2xl">
            <table className="min-w-full border border-gray-700 bg-gray-900">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Customer Name</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Email</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Court Type</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Date</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Time Slots</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Payment Method</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-center font-bold">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr 
                    key={booking.id || index} 
                    className="hover:bg-gray-800/50 transition border-b border-gray-800"
                  >
                    <td className="py-3 px-4 font-medium">{booking.name}</td>
                    <td className="py-3 px-4 text-gray-300">{booking.email}</td>
                    <td className={`py-3 px-4 font-semibold ${getCourtColor(booking.court)}`}>
                      {booking.court}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {booking.date} {booking.monthName}, {booking.year}
                    </td>
                    <td className="py-3 px-4 text-orange-400 font-medium">
                      {booking.timeSlots}
                    </td>
                    <td className={`py-3 px-4 font-medium ${getPaymentMethodColor(booking.paymentMethod)}`}>
                      {booking.paymentMethod}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary Stats - Based on filtered results */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-white">{filteredBookings.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-gray-900 p-6 rounded-lg border border-green-700/30">
            <p className="text-gray-400 text-sm mb-1">Paid</p>
            <p className="text-3xl font-bold text-green-400">
              {filteredBookings.filter(b => b.paymentStatus && b.paymentStatus.toLowerCase() === "paid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900 p-6 rounded-lg border border-red-700/30">
            <p className="text-gray-400 text-sm mb-1">Unpaid</p>
            <p className="text-3xl font-bold text-red-400">
              {filteredBookings.filter(b => b.paymentStatus && b.paymentStatus.toLowerCase() === "unpaid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 p-6 rounded-lg border border-blue-700/30">
            <p className="text-gray-400 text-sm mb-1">Online Payments</p>
            <p className="text-3xl font-bold text-blue-400">
              {filteredBookings.filter(b => b.paymentMethod && b.paymentMethod.toLowerCase() === "online").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;