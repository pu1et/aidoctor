const express = require('express');

const apiController = require('../controllers/api');

const router = express.Router();

router.post('/cold', apiController.postCold);

module.exports = router; 
