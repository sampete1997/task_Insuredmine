const express = require('express');
const { uploadFileToDb, searchPolicy, aggregatePolicy, scheduledMessage } = require('../controllers/policy.controller');
const { uploadFile } = require('../middleware/fileUpload');
const router = express.Router();


router.post('/upload',uploadFile.single('file'), uploadFileToDb);

// Search policy by username

router.get('/policy', searchPolicy);

// Aggregated policies per user

router.post('/aggregate_policy', aggregatePolicy);

router.post('/schedule_message', scheduledMessage);

module.exports = router;
