import api from "../utils/api";

// ✅ Fetch booked slots for a specific court
export const getBookedSlots = async (court) => {
  const response = await api.get(`/api/bookings/slots/${court}`);
  return response.data.bookedSlots;
};

// ✅ Create a new booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/api/bookings/create", bookingData);
  return response.data;
};

// ✅ Get all bookings (returns array with court info)
export const getAllBookings = async () => {
  const response = await api.get("/api/bookings/all");
  return response.data.bookings;
};

// ✅ Delete a booking (admin)
export const deleteBooking = async (court, bookingId) => {
  const response = await api.delete(`/api/bookings/${court}/${bookingId}`);
  return response.data;
};

// ✅ Update a booking (admin) - NEW
export const updateBooking = async (court, bookingId, updateData) => {
  const response = await api.put(`/api/bookings/${court}/${bookingId}`, updateData);
  return response.data;
};

// ✅ Export default object for backward compatibility
const bookingService = {
  getAll: getAllBookings,
  create: createBooking,
  getBookedSlots,
  delete: deleteBooking,
  update: updateBooking,
};

export default bookingService;