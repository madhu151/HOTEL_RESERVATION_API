# Node.js Application Setup

This guide provides step-by-step instructions on setting up Hotel Reservations Node.js application. MongoDB is a NoSQL database that is commonly used with Node.js for its flexibility and scalability.

## Prerequisites

- Node.js installed (https://nodejs.org/)
- MongoDB installed (https://docs.mongodb.com/manual/installation/)
- Install Postman (Which helps to hit API's and verify the response)
- Clone repository using git clone command(https://github.com/madhu151/HOTEL_RESERVATION_API.git)

## Setting up App
### 1. Clone the Repository
 - RUN the below command in the command prompt or VS code terminal or Git bash
    git clone https://github.com/madhu151/your-nodejs-app.git

 - RUN npm i(to install packages)

### 2. Start MongoDB Server

Make sure your MongoDB server is running. Open a terminal window and run:

``bash
mongod

### 2. Start Node Server
 - RUN npm run start (to run the node server)
 - RUN npm run test (to run the unit test cases and verify the code coverage)
 - Swagger UI access link http://localhost:5000/api/docs

## HOTEL_RESERVATION_API provides below API's
 - Endpoint for retrieving all reservations [http://localhost:5000/api/reservations]
 - Endpoint for retrieving a reservation by ID [http://localhost:5000/api/reservations/65ad2e6d1208930a85d69aec]
 - Endpoint for creating a reservation [http://localhost:5000/api/reservations]
 - Endpoint for cancelling a reservation [http://localhost:5000/api/reservations/65ad274f56747353dc5a5c18]
 - Endpoint for retrieving a Guests stay summary [http://localhost:5000/api/reservations/guest/12345/summary]
 - Endpoint to search for stays that span a date range (For example: Past 6 months, Next 12 months) [http://localhost:5000/api/reservations/search?startDate=2023-01-01&endDate=2024-06-30]

