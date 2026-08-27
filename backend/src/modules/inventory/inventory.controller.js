const {
    getAllProducts,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getStockLog,
    getLowStockProducts
} = require('./inventory.queries');

// ─── Products ───────────────────────────────────────────

const getProducts = async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await getProductById(parseInt(req.params.id));
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, sku, category, quantity, min_threshold, unit_price, supplier_id } = req.body;

        if (!name || !sku || !unit_price) {
            res.status(400).json({ message: 'Name, SKU, and unit price are required' });
            return;
        }

        // Check duplicate SKU
        const existing = await getProductBySku(sku);
        if (existing) {
            res.status(409).json({ message: 'SKU already exists' });
            return;
        }

        const product = await createProduct({
            name, sku, category,
            quantity: quantity || 0,
            min_threshold: min_threshold || 10,
            unit_price, supplier_id
        });

        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create product' });
    }
};

const editProduct = async (req, res) => {
    try {
        const product = await updateProduct(parseInt(req.params.id), req.body);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ message: 'Product updated', product });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update product' });
    }
};

const removeProduct = async (req, res) => {
    try {
        const product = await deleteProduct(parseInt(req.params.id));
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// ─── Stock ───────────────────────────────────────────────

const adjustStock = async (req, res) => {
    try {
        const { change_amount, reason } = req.body;
        const productId = parseInt(req.params.id);
        const userId = req.user.id;

        if (change_amount === undefined || !reason) {
            res.status(400).json({ message: 'change_amount and reason are required' });
            return;
        }

        const product = await updateStock(productId, change_amount, reason, userId);

        // Low stock warning in response
        const warning = product.quantity <= product.min_threshold
            ? `⚠️ Low stock alert: only ${product.quantity} units remaining`
            : null;

        res.json({ message: 'Stock updated', product, warning });
    } catch (err) {
        res.status(400).json({ message: err.message || 'Failed to update stock' });
    }
};

const getStockHistory = async (req, res) => {
    try {
        const productId = req.params.id ? parseInt(req.params.id) : undefined;
        const logs = await getStockLog(productId);
        res.json({ logs });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stock log' });
    }
};

const getLowStock = async (req, res) => {
    try {
        const products = await getLowStockProducts();
        res.json({ count: products.length, products });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch low stock products' });
    }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, removeProduct, adjustStock, getStockHistory, getLowStock };
