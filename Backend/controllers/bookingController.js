import CricketBooking from '../models/CricketBooking.js';
import FutsalBooking from '../models/FutsalBooking.js';
import PadelBooking from '../models/PadelBooking.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../lib/utility.js';

// Helper function to select correct model
const getModelByCourt = (court) => {
  switch (court) {
    case 'Cricket':
      return CricketBooking;
    case 'Futsal':
      return FutsalBooking;
    case 'Padel':
      return PadelBooking;
    default:
      return null;
  }
};

// ✅ Get booked slots for a court
export const getBookedSlots = TryCatch(async (req, res, next) => {
  const { court } = req.params;

  const Model = getModelByCourt(court);
  if (!Model) return next(new ErrorHandler('Invalid court type', 400));

  const bookings = await Model.find();

  const bookedSlots = {};
  bookings.forEach((booking) => {
    const key = `${booking.year}-${booking.month}-${booking.date}`;
    if (!bookedSlots[key]) bookedSlots[key] = [];
    bookedSlots[key].push(...booking.slots);
  });

  res.status(200).json({ success: true, bookedSlots });
});

// ✅ Create new booking
export const createBooking = TryCatch(async (req, res, next) => {
  const { court, year, month, date, slots, name, email, paymentMethod } = req.body;

  if (!court || !year || !month || !date || !slots || !name || !email || !paymentMethod) {
    return next(new ErrorHandler('All fields are required', 400));
  }

  const Model = getModelByCourt(court);
  if (!Model) return next(new ErrorHandler('Invalid court type', 400));

  if (!Array.isArray(slots) || slots.length === 0)
    return next(new ErrorHandler('Please select at least one slot', 400));
  if (slots.length > 3)
    return next(new ErrorHandler('Maximum 3 slots allowed per booking', 400));

  const existingBookings = await Model.find({ year, month, date });

  const alreadyBookedSlots = [];
  existingBookings.forEach((b) => {
    b.slots.forEach((slot) => {
      if (slots.includes(slot)) alreadyBookedSlots.push(slot);
    });
  });

  if (alreadyBookedSlots.length > 0)
    return next(new ErrorHandler(`Slots ${alreadyBookedSlots.join(', ')} are already booked`, 400));

  const newBooking = await Model.create({
    year,
    month,
    date,
    slots,
    name,
    email,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking: newBooking,
  });
});

// ✅ Get all bookings (admin)
export const getAllBookings = TryCatch(async (req, res) => {
  const cricket = await CricketBooking.find().sort({ createdAt: -1 });
  const futsal = await FutsalBooking.find().sort({ createdAt: -1 });
  const padel = await PadelBooking.find().sort({ createdAt: -1 });

  const all = [
    ...cricket.map((b) => ({ court: 'Cricket', ...b.toObject() })),
    ...futsal.map((b) => ({ court: 'Futsal', ...b.toObject() })),
    ...padel.map((b) => ({ court: 'Padel', ...b.toObject() })),
  ];

  res.status(200).json({ success: true, bookings: all });
});

// ✅ Delete booking (admin)
export const deleteBooking = TryCatch(async (req, res, next) => {
  const { court, id } = req.params;

  const Model = getModelByCourt(court);
  if (!Model) return next(new ErrorHandler('Invalid court type', 400));

  const booking = await Model.findById(id);
  if (!booking) return next(new ErrorHandler('Booking not found', 404));

  await booking.deleteOne();

  res.status(200).json({ success: true, message: 'Booking deleted successfully' });
});
