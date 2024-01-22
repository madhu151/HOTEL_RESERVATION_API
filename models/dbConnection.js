const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(`mongodb://${process.env.MONGOHOST}:${process.env.MONGOPORT}/${process.env.MONGODATABASE}`);
