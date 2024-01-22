const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const router = express.Router(),
    swaggerFile = path.join(__dirname, 'swagger.yaml'),
    swaggerData = fs.readFileSync(swaggerFile, 'utf8');

router.use(cors())
router.use('/', swaggerUi.serve, swaggerUi.setup(yaml.parse(swaggerData)));

module.exports = router;
