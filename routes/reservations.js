// Importing JavaScript packages
const express = require('express');
const { getAllReservations, getReservationByID, newReservation, cancelReservationByID,
searchStays, guestMemberStaySummary } = require('../services/reservations');
const router = express.Router();

// Endpoint for searching for stays that span a date range
router.get('/search', async (req, res) =>{
    try {
        const result = await searchStays(req.query.startDate, req.query.endDate);
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for retrieving all reservations
router.get('/', async (req, res) =>{
    try {
        const reservations = await getAllReservations();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint for retrieving a reservation by ID
router.get('/:reservationId', async (req, res) =>{
    try {
        const reservation = await getReservationByID(req.params.reservationId);
        if (reservation) {
            res.status(200).json(reservation);
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for creating a reservation
router.post('/', async (req, res) =>{
    try {
        const data = req.body;
        const result = await newReservation(data);
        res.status(201).json({ reservation_id: result._id, message: 'Reservation created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint for cancelling a reservation
router.delete('/:reservationId', async (req, res) =>{
    try {
        const result = await cancelReservationByID(req.params.reservationId);
        if (result) {
            res.json({ message: 'Reservation cancelled successfully' });
        } else {
            res.status(404).json({ message: 'Reservation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Endpoint for retrieving a guest's stay summary
router.get('/guest/:guestMemberId/summary', async (req, res) =>{
    try {
        const guestStaySummary = await guestMemberStaySummary(req.params.guestMemberId);
        res.json(guestStaySummary);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Catch 404 requests
router.use((err, req, res, next) => {
    next(new Error('Not Found'))
})

module.exports = {
    router
}
