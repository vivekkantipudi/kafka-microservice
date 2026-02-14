const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/generate', eventController.generateEvent);
router.get('/processed', eventController.getProcessedEvents);

module.exports = router;