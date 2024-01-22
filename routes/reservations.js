const express = require('express');
const reservationModel = require('../models/reservationSchema');
const router = express.Router();

const searchStays = async (req, res, next) => {
    try {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        const reservations = await reservationModel.find({
            arrival_date: { $lte: endDate },
            departure_date: { $gte: startDate },
        });
        return res.json(reservations);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Endpoint for searching for stays that span a date range
router.get('/search', searchStays);

const getAllReservations = async (req, res, next) => {

    try {
        const reservations = await reservationModel.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Endpoint for retrieving all reservations
router.get('/', getAllReservations);

const getReservationByID = async (req, res, next) => {
    try {
        const reservation = await reservationModel.findById(req.params.reservationId);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Endpoint for retrieving a reservation by ID
router.get('/:reservationId', getReservationByID);

const newReservation = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await reservationModel.create(data);
        res.status(201).json({ reservation_id: result._id, message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Endpoint for creating a reservation
router.post('/', newReservation);

const cancelReservationByID = async (req, res, next) => {
    try {
        const result = await reservationModel.findByIdAndDelete(req.params.reservationId);
        if (result) {
            res.json({ message: 'Reservation cancelled successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Endpoint for cancelling a reservation
router.delete('/:reservationId', cancelReservationByID);

const guestMemberStaySummary = async (req, res, next) => {
    try {
        const guestMemberId = req.params.guestMemberId;

        const upcomingStays = await reservationModel.find({
            guest_member_id: guestMemberId,
            arrival_date: { $gte: new Date() },
            status: 'active',
        });

        const pastStays = await reservationModel.find({
            guest_member_id: guestMemberId,
            departure_date: { $lt: new Date() },
            status: 'active',
        });

        const cancelledReservations = await reservationModel.find({
            guest_member_id: guestMemberId,
            status: 'cancelled',
        });

        const calculateTotalAmount = (stays) => {
            return stays.reduce((total, stay) => total + stay.base_stay_amount + stay.tax_amount, 0);
        };

        const summary = {
            guest_member_id: guestMemberId,
            upcoming_stay_info: {
                number_of_upcoming_stays: upcomingStays.length,
                total_nights_in_upcoming_stays: upcomingStays.reduce((total, stay) => total + getNightDifference(stay), 0),
                total_upcoming_stay_amount: calculateTotalAmount(upcomingStays),
            },
            past_stay_info: {
                number_of_past_stays: pastStays.length,
                total_nights_in_past_stays: pastStays.reduce((total, stay) => total + getNightDifference(stay), 0),
                total_past_stay_amount: calculateTotalAmount(pastStays),
            },
            cancelled_stay_info: {
                number_of_cancelled_reservations: cancelledReservations.length,
            },
            total_stays_amount: calculateTotalAmount([...upcomingStays, ...pastStays]),
        };

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Endpoint for retrieving a guest's stay summary
router.get('/guest/:guestMemberId/summary', guestMemberStaySummary);

// Helper function to calculate the night difference between arrival and departure dates
const getNightDifference = (stay) => {
    const arrivalDate = new Date(stay.arrival_date);
    const departureDate = new Date(stay.departure_date);
    const timeDifference = departureDate.getTime() - arrivalDate.getTime();
    const nightDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return nightDifference;
};

// Catch 404 requests
router.use((err, req, res, next) => {
    next(new Error('Not Found'))
})

module.exports = {
    getAllReservations,
    getReservationByID,
    newReservation,
    cancelReservationByID,
    searchStays,
    guestMemberStaySummary,
    router
}
