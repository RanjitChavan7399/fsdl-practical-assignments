const express = require('express');
const router = express.Router();
const { getCompanyInfo } = require('../controllers/companyController');

router.get('/:name', getCompanyInfo);

module.exports = router;
