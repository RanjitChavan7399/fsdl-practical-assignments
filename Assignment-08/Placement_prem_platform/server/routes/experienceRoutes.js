const express = require('express');
const router = express.Router();
const { getExperiences, createExperience } = require('../controllers/experienceController');

router.get('/experiences', getExperiences);
router.post('/experience', createExperience);

module.exports = router;
