const express = require('express');
const router = express.Router();
const controller = require('../controllers/emailControl');

router.post('/send-email', controller.Fetch_body);
router.post('/project-inquiry', controller.project_inquiries);
module.exports = router;