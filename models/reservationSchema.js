const mongoose = require('mongoose');

// Create a Mongoose schema for the reservation
const reservationSchema = mongoose.model('Reservation', new mongoose.Schema({
    guest_member_id: String,
    guest_name: String,
    hotel_name: String,
    arrival_date: Date,
    departure_date: Date,
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
    base_stay_amount: Number,
    tax_amount: Number,
  }));

  module.exports = reservationSchema;
  