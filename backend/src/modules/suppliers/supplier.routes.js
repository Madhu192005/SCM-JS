const { Router } = require('express');
const { getSuppliers, getSupplier, addSupplier, editSupplier, removeSupplier } = require('./supplier.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router.get('/', getSuppliers);                             // all roles
router.get('/:id', getSupplier);                           // all roles
router.post('/', authorize('admin', 'manager'), addSupplier);
router.patch('/:id', authorize('admin', 'manager'), editSupplier);
router.delete('/:id', authorize('admin'), removeSupplier);

module.exports = router;
