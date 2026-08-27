const db = require('../../config/database');

// ─── Products ───────────────────────────────────────────

const getAllProducts = async () => {
    const rows = db.prepare(`
        SELECT p.*, s.name AS supplier_name
        FROM products p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        ORDER BY p.created_at DESC
    `).all();
    return rows;
};

const getProductById = async (id) => {
    const row = db.prepare(`
        SELECT p.*, s.name AS supplier_name
        FROM products p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.id = ?
    `).get(id);
    return row || null;
};

const getProductBySku = async (sku) => {
    const row = db.prepare('SELECT * FROM products WHERE sku = ?').get(sku);
    return row || null;
};

const createProduct = async (data) => {
    const result = db.prepare(`
        INSERT INTO products (name, sku, category, quantity, min_threshold, unit_price, supplier_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
        data.name,
        data.sku,
        data.category,
        data.quantity,
        data.min_threshold,
        data.unit_price,
        data.supplier_id || null
    );
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    return row;
};

const updateProduct = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined)          { fields.push('name = ?');          values.push(data.name); }
    if (data.category !== undefined)      { fields.push('category = ?');      values.push(data.category); }
    if (data.min_threshold !== undefined) { fields.push('min_threshold = ?'); values.push(data.min_threshold); }
    if (data.unit_price !== undefined)    { fields.push('unit_price = ?');    values.push(data.unit_price); }
    if (data.supplier_id !== undefined)   { fields.push('supplier_id = ?');   values.push(data.supplier_id); }

    if (fields.length === 0) return null;

    values.push(id);
    db.prepare(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return row || null;
};

const deleteProduct = async (id) => {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!row) return null;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return row;
};

// ─── Stock Management ────────────────────────────────────

const updateStock = async (productId, changeAmount, reason, changedBy) => {
    const performUpdate = db.transaction(() => {
        const current = db.prepare('SELECT quantity FROM products WHERE id = ?').get(productId);

        if (!current) throw new Error('Product not found');

        const newQuantity = current.quantity + changeAmount;

        if (newQuantity < 0) {
            throw new Error(`Insufficient stock. Current: ${current.quantity}`);
        }

        db.prepare('UPDATE products SET quantity = ? WHERE id = ?').run(newQuantity, productId);

        db.prepare(`
            INSERT INTO stock_log (product_id, change_amount, reason, changed_by)
            VALUES (?, ?, ?, ?)
        `).run(productId, changeAmount, reason, changedBy);

        const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
        return updated;
    });

    return performUpdate();
};

const getStockLog = async (productId) => {
    if (productId) {
        return db.prepare(`
            SELECT sl.*, p.name AS product_name, u.name AS changed_by_name
            FROM stock_log sl
            LEFT JOIN products p ON sl.product_id = p.id
            LEFT JOIN users u ON sl.changed_by = u.id
            WHERE sl.product_id = ?
            ORDER BY sl.created_at DESC
        `).all(productId);
    } else {
        return db.prepare(`
            SELECT sl.*, p.name AS product_name, u.name AS changed_by_name
            FROM stock_log sl
            LEFT JOIN products p ON sl.product_id = p.id
            LEFT JOIN users u ON sl.changed_by = u.id
            ORDER BY sl.created_at DESC
            LIMIT 100
        `).all();
    }
};

// ─── Low Stock Alerts ────────────────────────────────────

const getLowStockProducts = async () => {
    const rows = db.prepare(`
        SELECT p.*, s.name AS supplier_name
        FROM products p
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.quantity <= p.min_threshold
        ORDER BY p.quantity ASC
    `).all();
    return rows;
};

module.exports = {
    getAllProducts,
    getProductById,
    getProductBySku,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getStockLog,
    getLowStockProducts
};
