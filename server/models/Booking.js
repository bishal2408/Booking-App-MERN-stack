import mongoose from "mongoose";

const bookingSchema = mongoose.Schema({
  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'place'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  price: Number
});

export const Booking = mongoose.model("booking", bookingSchema);
