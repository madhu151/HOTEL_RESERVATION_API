const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
require('./models/dbConnection');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors());

// Log request
app.use((req, res, next) =>{
    console.log(`${req.method} ${req.originalUrl}`)
    next()
})

app.use('/api', require('./routes'))

// Event listeners and uncaught exceptions
process.on('uncaughtException', (err) =>{
    console.error(`Caught exception: ${err.stack}`)
})

process.on('unhandledRejection', (err, promise) =>{
    console.error(`Unhandled rejection: ${promise}, reason: ${err}`)
})

// Error handler
app.use((err, req, res, next) =>{
    console.log(`Something went wrong: ${err}`)
    res.status(err.status || 500).json(err)
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
