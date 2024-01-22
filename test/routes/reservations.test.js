const mocha = require('mocha'),
    sinon = require('sinon'),
    { stub, spy } = sinon,
    { describe, before, beforeEach, after, afterEach, it } = mocha,
    {
        getAllReservations,
        getReservationByID,
        newReservation,
        cancelReservationByID,
        searchStays,
        guestMemberStaySummary
    } = require('../../routes/reservations'),
    reservationModel = require('../../models/reservationSchema');

describe('Get All Reservations', () => {
    let req = {}, sandbox, modelStub, res;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    })

    afterEach(() => {
        sandbox.restore()
    })

    it('Should get all reservations', async () => {
        modelStub = sandbox.stub(reservationModel, 'find')
        modelStub.resolves([]);
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await getAllReservations(req, res);
        sinon.assert.calledOnce(modelStub)
    })

    it('Should get a reservation by id', async () => {
        req = {
            params: {
                reservationId: 12345
            }
        }
        modelStub = sandbox.stub(reservationModel, 'findById')
        modelStub.resolves([]);
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await getReservationByID(req, res);
        sinon.assert.calledOnce(modelStub)
    })

    it('Should create a reservation', async () => {
        req = {
            body: {
                "guest_member_id": "12345",
                "guest_name": "John Doe",
                "hotel_name": "Example Hotel",
                "arrival_date": "2024-01-20",
                "departure_date": "2024-01-25",
                "status": "active",
                "base_stay_amount": 200.00,
                "tax_amount": 20.00
              }
        }
        modelStub = sandbox.stub(reservationModel, 'create')
        modelStub.resolves({
            "reservation_id": "65ad2e6d1208930a85d69aec",
            "message": "Reservation created successfully"
        });
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await newReservation(req, res);
        sinon.assert.calledOnce(modelStub)
    })

    it('Should cancel a reservation by id', async () => {
        req = {
            params: {
                reservationId: 12345
            }
        }
        modelStub = sandbox.stub(reservationModel, 'findByIdAndDelete')
        modelStub.resolves([]);
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await cancelReservationByID(req, res);
        sinon.assert.calledOnce(modelStub)
    })

    it('Should search for stays that span a date range', async () => {
        req = {
            query: {
                startDate: '2023-01-01',
                endDate: '2024-06-30'
            }
        }
        modelStub = sandbox.stub(reservationModel, 'find')
        modelStub.resolves([]);
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await searchStays(req, res);
        sinon.assert.calledOnce(modelStub)
    })

    it('Should retrieve guest stay summary', async () => {
        req = {
            params: {
                reservationId: 12345
            }
        }
        modelStub = sandbox.stub(reservationModel, 'find')
        modelStub.resolves([{
            "_id": "65ad2e6d1208930a85d69aec",
            "guest_member_id": "12345",
            "guest_name": "John Doe",
            "hotel_name": "Example Hotel",
            "arrival_date": "2024-01-20T00:00:00.000Z",
            "departure_date": "2024-01-25T00:00:00.000Z",
            "status": "active",
            "base_stay_amount": 200,
            "tax_amount": 20,
            "__v": 0
        }]);
        const jsonCb = sinon.spy();
        res = {
            json: jsonCb,
            status: sinon.stub().returns({ json: jsonCb })
        }
        await guestMemberStaySummary(req, res);
        sinon.assert.calledThrice(modelStub)
    })
})