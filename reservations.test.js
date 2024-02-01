// Importing JavaScript packages
const mocha = require('mocha'),
    sinon = require('sinon'),
    assert = require('assert'),
    { describe, beforeEach, afterEach, it } = mocha,
    {
        getAllReservations,
        getReservationByID,
    } = require('../../services/reservations'),
    reservationModel = require('../../models/reservationSchema');

describe('GET All Reservations', () => {
    let sandbox, getAllReservationsStub;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        getAllReservationsStub = sandbox.stub(reservationModel, 'find')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('Testing getAllReservations() - Should get all reservations', async () => {
        getAllReservationsStub.resolves([]);
        const result = await getAllReservations();
        sinon.assert.calledOnce(getAllReservationsStub);
        assert.equal(result.length, 0)
    })

    it('Testing getAllReservations() - Should return error while fetching reservations', async () => {
        try {
            getAllReservationsStub.rejects({ message: 'Internal Server Error' });
            await getAllReservations();
        } catch (e) {
            assert.equal(e.message, 'Internal Server Error')
        }
    })
});

describe('GET Reservation by ID', () => {
    let sandbox, getReservationByIdStub;
    const reservationId = 12345;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        getReservationByIdStub = sandbox.stub(reservationModel, 'findById')
    })

    afterEach(() => {
        sandbox.restore()
    })
    it('Should get a reservation by id', async () => {
        
        getReservationByIdStub.resolves({
            "_id": "65b83462e2f127533883272f",
            "guest_member_id": "12345",
            "guest_name": "John Doe",
            "hotel_name": "Example Hotel",
            "arrival_date": "2024-01-20T00:00:00.000Z",
            "departure_date": "2024-01-25T00:00:00.000Z",
            "status": "cancelled",
            "base_stay_amount": 200,
            "tax_amount": 20,
            "__v": 0
        });
        
        const result = await getReservationByID(reservationId);
        sinon.assert.calledOnce(getReservationByIdStub);
        assert.equal(typeof result, 'object')
    })

    it('Should return error while fetching reservation by id', async () => {
        try {
            getReservationByIdStub.rejects({ message: 'Internal Server Error' });
            await getReservationByID(reservationId);
        } catch (e) {
            assert.equal(e.message, 'Internal Server Error')
        }
    })
})
