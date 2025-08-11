const express = require('express');
const router = express.Router();
const controller = require('../controllers/emailControl');

router.post('/contact', controller.contact);
router.post('/quote', controller.Quote);
module.exports = router;