const reservationModel = require('../models/reservationSchema');

/**
 * 
 * @returns list of reservations
 */
const getAllReservations = async () => {
    try {
        return await reservationModel.find();
    } catch (error) {
        return error.message;
    }
}

/**
 * 
 * @param {String} reservationId 
 * @returns reservation based on given reservationsId
 */
const getReservationByID = async (reservationId) => {
    try {
        return await reservationModel.findById(reservationId);
    } catch (error) {
        return error.message;
    }
}

/**
 * 
 * @param {Object} data 
 * @returns reservationId and success message
 */
const newReservation = async (data) => {
    try {
        return await reservationModel.create(data);
    } catch (error) {
        return error.message;
    }
}

/**
 * 
 * @param {String} reservationId 
 * @returns message
 */
const cancelReservationByID = async (reservationId) => {
    try {
        return await reservationModel.findByIdAndUpdate(reservationId, { $set: { status: 'cancelled' } });
    } catch (error) {
        return error.message;
    }
}

/**
 * 
 * @param {String} startDate 
 * @param {String} endDate 
 * @returns list of stays that span a date range
 */
const searchStays = async (startDate, endDate) => {

    try {
        const reservations = await reservationModel.find({
            arrival_date: { $lte: new Date(endDate) },
            departure_date: { $gte: new Date(startDate) },
        });
        return reservations;
    } catch (error) {
        return error.message;
    }
}

/**
 * 
 * @param {String} guestMemberId 
 * @returns guest stay summary
 */
const guestMemberStaySummary = async (guestMemberId) => {
    try {
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

        return summary;
    } catch (error) {
        return error.message;
    }
}

/**
 * Helper function to calculate the night difference between arrival and departure dates
 * @param {Object} stay 
 * @returns night differnece based on the stay arrival and departure dates
 */
const getNightDifference = (stay) => {
    const arrivalDate = new Date(stay.arrival_date);
    const departureDate = new Date(stay.departure_date);
    const timeDifference = departureDate.getTime() - arrivalDate.getTime();
    const nightDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return nightDifference;
};

module.exports = {
    getAllReservations,
    getReservationByID,
    newReservation,
    cancelReservationByID,
    searchStays,
    guestMemberStaySummary
}
