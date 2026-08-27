const { Router } = require('express');
const { getAnalytics } = require('./analytics.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = Router();

router.get('/', authenticate, authorize('admin', 'manager'), getAnalytics);

module.exports = router;
