// // src/services/bookingService.js
// import api from "../utils/api";

// // ✅ Create a new booking
// export const createBooking = async (bookingData) => {
//   const response = await api.post("/api/bookings/create", bookingData);
//   return response.data;
// };

// // ✅ Get all bookings (for admin)
// export const getAllBookings = async () => {
//   const response = await api.get("/api/bookings");
//   return response.data;
// };

// // ✅ Get bookings for a specific user
// export const getUserBookings = async (userId) => {
//   const response = await api.get(`/api/bookings/user/${userId}`);
//   return response.data;
// };

// // ✅ Cancel or delete a booking
// export const cancelBooking = async (bookingId) => {
//   const response = await api.delete(`/api/bookings/${bookingId}`);
//   return response.data;
// };




// // src/services/bookingService.js
// import api from "../utils/api";

// // ✅ Fetch booked slots for a specific court
// export const getBookedSlots = async (court) => {
//   const response = await api.get(`/api/bookings/slots/${court}`);
//   return response.data.bookedSlots;
// };

// // ✅ Create a new booking
// export const createBooking = async (bookingData) => {
//   const response = await api.post("/api/bookings/create", bookingData);
//   return response.data;
// };

// // ✅ Get all bookings (for admin dashboard)
// export const getAllBookings = async () => {
//   const response = await api.get("/api/bookings/all");
//   return response.data.bookings;
// };

// // ✅ Delete a booking (admin)
// export const deleteBooking = async (court, bookingId) => {
//   const response = await api.delete(`/api/bookings/${court}/${bookingId}`);
//   return response.data;
// };


// src/services/bookingService.js
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

// ✅ Export default object for backward compatibility
const bookingService = {
  getAll: getAllBookings,
  create: createBooking,
  getBookedSlots,
  delete: deleteBooking,
};

export default bookingService;