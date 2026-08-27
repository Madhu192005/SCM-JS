const { Router } = require('express');
const { register, login, getMe, getUsers, toggleUser } = require('./auth.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/register', authenticate, authorize('admin'), register);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.patch('/users/:id/toggle', authenticate, authorize('admin'), toggleUser);

module.exports = router;
