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

  // Fetch booked slots when Add modal opens or date changes
  useEffect(() => {
    if (showAddModal) {
      fetchBookedSlotsForAdd();
    }
  }, [showAddModal, newBooking.court, newBooking.year, newBooking.month, newBooking.date]);

  // Fetch booked slots when Edit modal opens or date changes
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
      
      // Exclude slots from the current booking being edited
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
      slots: [...booking.slots] // Create a copy
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
      // Check if slot is already booked by someone else
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
      // Check if slot is already booked
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
      // In edit mode, slot is disabled if it's booked by someone else
      return bookedSlotsForEdit.includes(slotIndex);
    } else {
      // In add mode, slot is disabled if it's already booked
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

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Manage Bookings
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
          >
            + Add Booking
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-gray-300 font-medium">Filter by Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "all" ? "bg-gradient-to-r from-orange-600 to-red-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter("cricket")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "cricket" ? "bg-green-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Cricket ({bookings.filter(b => b.court.toLowerCase() === "cricket").length})
          </button>
          <button
            onClick={() => setFilter("futsal")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "futsal" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Futsal ({bookings.filter(b => b.court.toLowerCase() === "futsal").length})
          </button>
          <button
            onClick={() => setFilter("padel")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              filter === "padel" ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Padel ({bookings.filter(b => b.court.toLowerCase() === "padel").length})
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center text-lg mt-12 bg-gray-900 rounded-lg p-8">
            <p className="text-gray-400">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-2xl">
            <table className="min-w-full border border-gray-700 bg-gray-900">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Name</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Email</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Court</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Date</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Time Slots</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-left font-bold">Payment</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-center font-bold">Status</th>
                  <th className="py-4 px-4 border-b border-gray-700 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={booking.id || index} className="hover:bg-gray-800/50 transition border-b border-gray-800">
                    <td className="py-3 px-4 font-medium">{booking.name}</td>
                    <td className="py-3 px-4 text-gray-300">{booking.email}</td>
                    <td className="py-3 px-4 font-semibold text-orange-400">{booking.court}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {booking.date} {booking.monthName}, {booking.year}
                    </td>
                    <td className="py-3 px-4 text-orange-400 font-medium">{booking.timeSlots}</td>
                    <td className="py-3 px-4 text-blue-400">{booking.paymentMethod}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.paymentStatus?.toLowerCase() === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditClick(booking)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition"
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
        )}

        {/* Add Booking Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-orange-400">Add New Booking</h2>
              <form onSubmit={handleAddBooking} className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newBooking.name}
                  onChange={(e) => setNewBooking({...newBooking, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                  required
                />
                <select
                  value={newBooking.court}
                  onChange={(e) => setNewBooking({...newBooking, court: e.target.value, slots: []})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Cricket">Cricket</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Padel">Padel</option>
                </select>
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Date"
                    min="1"
                    max="31"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({...newBooking, date: parseInt(e.target.value), slots: []})}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={newBooking.month}
                    onChange={(e) => setNewBooking({...newBooking, month: parseInt(e.target.value), slots: []})}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
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
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium">Select Time Slots (Max 3):</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-800 rounded-lg">
                    {timeSlots.map((slot, idx) => {
                      const isBooked = isSlotDisabled(idx, false);
                      const isSelected = newBooking.slots.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSlotToggle(idx, false)}
                          disabled={isBooked && !isSelected}
                          className={`px-3 py-2 rounded text-sm transition ${
                            isSelected
                              ? "bg-orange-600 text-white"
                              : isBooked
                              ? "bg-gray-900 text-gray-600 cursor-not-allowed opacity-50"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {slot} {isBooked && !isSelected && "🔒"}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-400">Selected: {newBooking.slots.length}/3 slots</p>
                </div>

                <select
                  value={newBooking.paymentMethod}
                  onChange={(e) => setNewBooking({...newBooking, paymentMethod: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>

                <select
                  value={newBooking.paymentStatus}
                  onChange={(e) => setNewBooking({...newBooking, paymentStatus: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 py-2 rounded-lg font-semibold hover:opacity-90 transition"
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
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition"
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
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Edit Booking</h2>
              <form onSubmit={handleUpdateBooking} className="space-y-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={editingBooking.name}
                  onChange={(e) => setEditingBooking({...editingBooking, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingBooking.email}
                  onChange={(e) => setEditingBooking({...editingBooking, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Date"
                    min="1"
                    max="31"
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({...editingBooking, date: parseInt(e.target.value)})}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={editingBooking.month}
                    onChange={(e) => setEditingBooking({...editingBooking, month: parseInt(e.target.value)})}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium">Select Time Slots (Max 3):</label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-gray-800 rounded-lg">
                    {timeSlots.map((slot, idx) => {
                      const isBooked = isSlotDisabled(idx, true);
                      const isSelected = editingBooking.slots.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSlotToggle(idx, true)}
                          disabled={isBooked && !isSelected}
                          className={`px-3 py-2 rounded text-sm transition ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : isBooked
                              ? "bg-gray-900 text-gray-600 cursor-not-allowed opacity-50"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {slot} {isBooked && !isSelected && "🔒"}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm text-gray-400">Selected: {editingBooking.slots.length}/3 slots</p>
                </div>

                <select
                  value={editingBooking.paymentMethod}
                  onChange={(e) => setEditingBooking({...editingBooking, paymentMethod: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>

                <select
                  value={editingBooking.paymentStatus}
                  onChange={(e) => setEditingBooking({...editingBooking, paymentStatus: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 py-2 rounded-lg font-semibold hover:opacity-90 transition"
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
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-white">{filteredBookings.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-gray-900 p-6 rounded-lg border border-green-700/30">
            <p className="text-gray-400 text-sm mb-1">Paid</p>
            <p className="text-3xl font-bold text-green-400">
              {filteredBookings.filter(b => b.paymentStatus?.toLowerCase() === "paid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-gray-900 p-6 rounded-lg border border-red-700/30">
            <p className="text-gray-400 text-sm mb-1">Unpaid</p>
            <p className="text-3xl font-bold text-red-400">
              {filteredBookings.filter(b => b.paymentStatus?.toLowerCase() === "unpaid").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-gray-900 p-6 rounded-lg border border-blue-700/30">
            <p className="text-gray-400 text-sm mb-1">Online Payments</p>
            <p className="text-3xl font-bold text-blue-400">
              {filteredBookings.filter(b => b.paymentMethod?.toLowerCase() === "online").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;