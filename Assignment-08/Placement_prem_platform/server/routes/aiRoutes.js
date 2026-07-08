const express = require('express');
const router = express.Router();
const { analyzeCompany, generateQuestions, evaluateAnswer, analyzeResume } = require('../controllers/aiController');

router.post('/analyze', analyzeCompany);
router.post('/questions', generateQuestions);
router.post('/evaluate-answer', evaluateAnswer);
router.post('/analyze-resume', analyzeResume);

module.exports = router;
