import React, { useEffect, useState } from "react";
import { getAllBookings, deleteBooking, updateBooking, createBooking, getBookedSlots } from "../../services/bookingService";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookedSlotsForEdit, setBookedSlotsForEdit] = useState([]);
  const [bookedSlotsForAdd, setBookedSlotsForAdd] = useState([]);

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

  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    court: "Cricket",
    date: 1,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    slots: [],
    paymentMethod: "Cash",
    paymentStatus: "Unpaid"
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (showAddModal) {
      fetchBookedSlotsForAdd();
    }
  }, [showAddModal, newBooking.court, newBooking.year, newBooking.month, newBooking.date]);

  useEffect(() => {
    if (showEditModal && editingBooking) {
      fetchBookedSlotsForEdit();
    }
  }, [showEditModal, editingBooking?.court, editingBooking?.year, editingBooking?.month, editingBooking?.date]);

  const fetchBookedSlotsForAdd = async () => {
    try {
      const slots = await getBookedSlots(newBooking.court);
      const key = `${newBooking.year}-${newBooking.month}-${newBooking.date}`;
      setBookedSlotsForAdd(slots[key] || []);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookedSlotsForAdd([]);
    }
  };

  const fetchBookedSlotsForEdit = async () => {
    if (!editingBooking) return;
    try {
      const slots = await getBookedSlots(editingBooking.court);
      const key = `${editingBooking.year}-${editingBooking.month}-${editingBooking.date}`;
      const allBookedSlots = slots[key] || [];
      
      const otherBookedSlots = allBookedSlots.filter(
        slot => !editingBooking.slots.includes(slot)
      );
      
      setBookedSlotsForEdit(otherBookedSlots);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setBookedSlotsForEdit([]);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingsData = await getAllBookings();
      
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
              slots: [],
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
            slots: booking.slots || [],
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

  const handleCancelBooking = async (booking) => {
    if (!window.confirm(`Are you sure you want to cancel booking for ${booking.name}?`)) {
      return;
    }

    try {
      await deleteBooking(booking.court, booking.id);
      alert("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert(`Failed to cancel booking: ${err.message}`);
    }
  };

  const handleEditClick = (booking) => {
    setEditingBooking({
      id: booking.id,
      court: booking.court,
      name: booking.name,
      email: booking.email,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      date: booking.date,
      month: booking.month,
      year: booking.year,
      slots: [...booking.slots]
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async (e) => {
    e.preventDefault();
    
    if (!editingBooking.name || !editingBooking.email || editingBooking.slots.length === 0) {
      alert("Please fill all required fields and select at least one slot");
      return;
    }

    try {
      await updateBooking(editingBooking.court, editingBooking.id, {
        name: editingBooking.name,
        email: editingBooking.email,
        paymentMethod: editingBooking.paymentMethod,
        paymentStatus: editingBooking.paymentStatus,
        slots: editingBooking.slots,
        date: editingBooking.date,
        month: editingBooking.month,
        year: editingBooking.year
      });

      alert("Booking updated successfully!");
      setShowEditModal(false);
      setEditingBooking(null);
      setBookedSlotsForEdit([]);
      fetchBookings();
    } catch (err) {
      console.error("Error updating booking:", err);
      alert(`Failed to update booking: ${err.message}`);
    }
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    
    if (!newBooking.name || !newBooking.email || newBooking.slots.length === 0) {
      alert("Please fill all required fields and select at least one slot");
      return;
    }

    try {
      await createBooking({
        ...newBooking,
        court: newBooking.court
      });

      alert("Booking added successfully!");
      setShowAddModal(false);
      setNewBooking({
        name: "",
        email: "",
        court: "Cricket",
        date: 1,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        slots: [],
        paymentMethod: "Cash",
        paymentStatus: "Unpaid"
      });
      setBookedSlotsForAdd([]);
      fetchBookings();
    } catch (err) {
      console.error("Error adding booking:", err);
      alert(`Failed to add booking: ${err.message}`);
    }
  };

  const handleSlotToggle = (slotIndex, isEdit = false) => {
    if (isEdit) {
      if (bookedSlotsForEdit.includes(slotIndex) && !editingBooking.slots.includes(slotIndex)) {
        alert("This slot is already booked by another customer");
        return;
      }

      setEditingBooking(prev => {
        const slots = [...prev.slots];
        const idx = slots.indexOf(slotIndex);
        if (idx > -1) {
          slots.splice(idx, 1);
        } else {
          if (slots.length >= 3) {
            alert("Maximum 3 slots allowed");
            return prev;
          }
          slots.push(slotIndex);
        }
        return { ...prev, slots: slots.sort((a, b) => a - b) };
      });
    } else {
      if (bookedSlotsForAdd.includes(slotIndex)) {
        alert("This slot is already booked");
        return;
      }

      setNewBooking(prev => {
        const slots = [...prev.slots];
        const idx = slots.indexOf(slotIndex);
        if (idx > -1) {
          slots.splice(idx, 1);
        } else {
          if (slots.length >= 3) {
            alert("Maximum 3 slots allowed");
            return prev;
          }
          slots.push(slotIndex);
        }
        return { ...prev, slots: slots.sort((a, b) => a - b) };
      });
    }
  };

  const isSlotDisabled = (slotIndex, isEdit = false) => {
    if (isEdit) {
      return bookedSlotsForEdit.includes(slotIndex);
    } else {
      return bookedSlotsForAdd.includes(slotIndex);
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

  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#258181] to-[#8cd3d3] bg-clip-text text-transparent mb-2 sm:mb-3">
            Manage Bookings
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 px-2">
            View, edit, and manage all court reservations
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#1a6868] to-[#89cfcf] hover:opacity-90 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition shadow-lg text-white text-sm sm:text-base"
          >
            + Add New Booking
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20 mb-6 sm:mb-8">
          
          {/* Date Filter */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <label className="text-[#1e9797] font-semibold text-sm sm:text-base text-center sm:text-left">Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 sm:px-4 py-2 rounded-lg bg-white text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 rounded-lg transition font-semibold text-white text-sm sm:text-base"
              >
                Clear Date
              </button>
            )}
          </div>

          {/* Court Filter Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-sm sm:text-base ${
                filter === "all"
                  ? "bg-gradient-to-r from-[#1a6868] to-[#89cfcf] text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter("cricket")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-sm sm:text-base ${
                filter === "cricket"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              Cricket ({bookings.filter(b => b.court.toLowerCase() === "cricket").length})
            </button>
            <button
              onClick={() => setFilter("futsal")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-sm sm:text-base ${
                filter === "futsal"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white/50 text-[#1e9797] hover:bg-white/70"
              }`}
            >
              Futsal ({bookings.filter(b => b.court.toLowerCase() === "futsal").length})
            </button>
            <button
              onClick={() => setFilter("padel")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition duration-300 text-sm sm:text-base ${
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
          <div className="mb-4 sm:mb-6 text-center px-2">
            <p className="text-[#1e9797] font-medium text-sm sm:text-base lg:text-lg">
              Showing {filteredBookings.length} booking(s)
              {filter !== "all" && ` for ${filter}`}
              {dateFilter && ` on ${new Date(dateFilter).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`}
            </p>
          </div>
        )}

        {filteredBookings.length === 0 ? (
          <div className="text-center text-base sm:text-lg mt-8 sm:mt-12 bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-white/20">
            <p className="text-gray-600 text-lg sm:text-xl">No bookings found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-2xl bg-[#1e9797]/10 backdrop-blur-xl border border-white/20">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#1a6868] to-[#89cfcf]">
                    <th className="py-4 px-4 text-left font-bold text-white">Name</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Email</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Court</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Date</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Time Slots</th>
                    <th className="py-4 px-4 text-left font-bold text-white">Payment</th>
                    <th className="py-4 px-4 text-center font-bold text-white">Status</th>
                    <th className="py-4 px-4 text-center font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/80">
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking.id || index} className="hover:bg-[#1e9797]/20 transition duration-200 border-b border-[#1e9797]/20">
                      <td className="py-3 px-4 font-semibold text-gray-800">{booking.name}</td>
                      <td className="py-3 px-4 text-gray-600">{booking.email}</td>
                      <td className={`py-3 px-4 font-bold ${getCourtColor(booking.court)}`}>{booking.court}</td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {booking.date} {booking.monthName}, {booking.year}
                      </td>
                      <td className="py-3 px-4 text-orange-500 font-semibold">{booking.timeSlots}</td>
                      <td className={`py-3 px-4 font-semibold ${getPaymentMethodColor(booking.paymentMethod)}`}>
                        {booking.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border-2 ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking)}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {filteredBookings.map((booking, index) => (
                <div key={booking.id || index} className="bg-white/90 backdrop-blur-xl rounded-xl shadow-lg p-4 sm:p-6 border border-[#1e9797]/20">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">{booking.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{booking.email}</p>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 whitespace-nowrap ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm sm:text-base">
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1">Court</p>
                      <p className={`font-bold ${getCourtColor(booking.court)}`}>{booking.court}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1">Date</p>
                      <p className="text-gray-700 font-medium text-xs sm:text-sm">{booking.date} {booking.monthName}, {booking.year}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1">Payment</p>
                      <p className={`font-semibold ${getPaymentMethodColor(booking.paymentMethod)}`}>{booking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs sm:text-sm mb-1">Time</p>
                      <p className="text-orange-500 font-semibold text-xs sm:text-sm break-words">{booking.timeSlots}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(booking)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 px-4 py-2 rounded-lg text-sm font-semibold transition text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Add Booking Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1e9797]/20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-[#258181] to-[#8cd3d3] bg-clip-text text-transparent">Add New Booking</h2>
              <form onSubmit={handleAddBooking} className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newBooking.name}
                  onChange={(e) => setNewBooking({...newBooking, name: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                  required
                />
                <select
                  value={newBooking.court}
                  onChange={(e) => setNewBooking({...newBooking, court: e.target.value, slots: []})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                >
                  <option value="Cricket">Cricket</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Padel">Padel</option>
                </select>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Date"
                    min="1"
                    max="31"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: parseInt(e.target.value), slots: []})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                  />
                  <select
                    value={newBooking.month}
                    onChange={(e) => setNewBooking({...newBooking, month: parseInt(e.target.value), slots: []})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                  >
                    {months.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Year"
                    min="2025"
                    value={newBooking.year}
                    onChange={(e) => setNewBooking({...newBooking, year: parseInt(e.target.value), slots: []})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[#1e9797] font-semibold text-base sm:text-lg">Select Time Slots (Max 3):</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded-lg border border-[#1e9797]/20">
                    {timeSlots.map((slot, idx) => {
                      const isBooked = isSlotDisabled(idx, false);
                      const isSelected = newBooking.slots.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSlotToggle(idx, false)}
                          disabled={isBooked && !isSelected}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            isSelected
                              ? "bg-gradient-to-r from-[#1a6868] to-[#89cfcf] text-white shadow-md"
                              : isBooked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-[#1e9797]/10 border border-gray-200"
                          }`}
                        >
                          {slot} {isBooked && !isSelected && "🔒"}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Selected: {newBooking.slots.length}/3 slots</p>
                </div>

                <select
                  value={newBooking.paymentMethod}
                  onChange={(e) => setNewBooking({...newBooking, paymentMethod: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>

                <select
                  value={newBooking.paymentStatus}
                  onChange={(e) => setNewBooking({...newBooking, paymentStatus: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-[#1e9797]/30 focus:outline-none focus:ring-2 focus:ring-[#1e9797] text-sm sm:text-base"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg text-sm sm:text-base"
                  >
                    Add Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewBooking({
                        name: "",
                        email: "",
                        court: "Cricket",
                        date: 1,
                        month: new Date().getMonth(),
                        year: new Date().getFullYear(),
                        slots: [],
                        paymentMethod: "Cash",
                        paymentStatus: "Unpaid"
                      });
                      setBookedSlotsForAdd([]);
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Booking Modal */}
        {showEditModal && editingBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#1e9797]/20">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Edit Booking</h2>
              <form onSubmit={handleUpdateBooking} className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={editingBooking.name}
                  onChange={(e) => setEditingBooking({...editingBooking, name: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingBooking.email}
                  onChange={(e) => setEditingBooking({...editingBooking, email: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <input
                    type="number"
                    placeholder="Date"
                    min="1"
                    max="31"
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: parseInt(e.target.value)})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                  <select
                    value={editingBooking.month}
                    onChange={(e) => setEditingBooking({...editingBooking, month: parseInt(e.target.value)})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  >
                    {months.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Year"
                    min="2025"
                    value={editingBooking.year}
                    onChange={(e) => setEditingBooking({...editingBooking, year: parseInt(e.target.value)})}
                    className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-blue-600 font-semibold text-base sm:text-lg">Select Time Slots (Max 3):</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 sm:p-3 bg-gray-50 rounded-lg border border-blue-400/20">
                    {timeSlots.map((slot, idx) => {
                      const isBooked = isSlotDisabled(idx, true);
                      const isSelected = editingBooking.slots.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSlotToggle(idx, true)}
                          disabled={isBooked && !isSelected}
                          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                            isSelected
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                              : isBooked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
                          }`}
                        >
                          {slot} {isBooked && !isSelected && "🔒"}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Selected: {editingBooking.slots.length}/3 slots</p>
                </div>

                <select
                  value={editingBooking.paymentMethod}
                  onChange={(e) => setEditingBooking({...editingBooking, paymentMethod: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>

                <select
                  value={editingBooking.paymentStatus}
                  onChange={(e) => setEditingBooking({...editingBooking, paymentStatus: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 text-gray-800 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg text-sm sm:text-base"
                  >
                    Update Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingBooking(null);
                      setBookedSlotsForEdit([]);
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-[#1e9797]/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Total Bookings</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#1a6868] to-[#89cfcf] bg-clip-text text-transparent">
              {filteredBookings.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 border border-green-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-green-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Paid</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600">
              {filteredBookings.filter(b => b.paymentStatus?.toLowerCase() === "paid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 sm:p-6 border border-red-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-red-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Unpaid</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">
              {filteredBookings.filter(b => b.paymentStatus?.toLowerCase() === "unpaid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 border border-blue-200 text-center hover:-translate-y-2 transition-transform duration-300">
            <p className="text-blue-700 text-xs sm:text-sm mb-1 sm:mb-2 font-medium">Online Payments</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
              {filteredBookings.filter(b => b.paymentMethod?.toLowerCase() === "online").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;