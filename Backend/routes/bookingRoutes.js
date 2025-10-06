import express from 'express';
import {
  getBookedSlots,
  createBooking,
  getAllBookings,
  deleteBooking,
} from '../controllers/bookingController.js';

const router = express.Router();

// Public
router.get('/slots/:court', getBookedSlots);
router.post('/create', createBooking);

// Admin
router.get('/all', getAllBookings);
router.delete('/:court/:id', deleteBooking);

export default router;
