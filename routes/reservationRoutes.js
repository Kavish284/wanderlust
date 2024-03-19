const express = require('express');
const router = express.Router();
const reservationController = require('../Controller/reservationController.js');

// Route for creating a new reservation
router.post('/:id/reserve', reservationController.createReservation);

// Route for updating an existing reservation

module.exports = router;
