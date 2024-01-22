const express = require('express');
const router = express.Router();

router.use('/docs', require('./docs'))
router.use('/reservations', require('./reservations').router)

module.exports = router;