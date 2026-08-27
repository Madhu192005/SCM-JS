const { Router } = require('express');
const {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    removeProduct,
    adjustStock,
    getStockHistory,
    getLowStock
} = require('./inventory.controller');
const { authenticate, authorize } = require('../../middleware/auth.middleware');

const router = Router();

// All routes require authentication
router.use(authenticate);

// Product routes
router.get('/', getProducts);               // all roles
router.get('/low-stock', getLowStock);      // all roles
router.get('/stock-log', getStockHistory);  // all roles
router.get('/:id', getProduct);             // all roles
router.get('/:id/log', getStockHistory);    // all roles

// Manager + Admin only
router.post('/', authorize('admin', 'manager'), addProduct);
router.patch('/:id', authorize('admin', 'manager'), editProduct);
router.delete('/:id', authorize('admin'), removeProduct);

// Stock adjustment — all roles can update stock
router.patch('/:id/stock', adjustStock);

module.exports = router;
