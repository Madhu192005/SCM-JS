const db = require('../../config/database');

const getAllSuppliers = async () => {
    const rows = db.prepare(`
        SELECT s.*, COUNT(p.id) AS product_count
        FROM suppliers s
        LEFT JOIN products p ON p.supplier_id = s.id
        GROUP BY s.id
        ORDER BY s.created_at DESC
    `).all();
    return rows;
};

const getSupplierById = async (id) => {
    const row = db.prepare(`
        SELECT s.*, COUNT(p.id) AS product_count
        FROM suppliers s
        LEFT JOIN products p ON p.supplier_id = s.id
        WHERE s.id = ?
        GROUP BY s.id
    `).get(id);
    return row || null;
};

const createSupplier = async (data) => {
    const result = db.prepare(`
        INSERT INTO suppliers (name, email, phone, address)
        VALUES (?, ?, ?, ?)
    `).run(
        data.name,
        data.email || null,
        data.phone || null,
        data.address || null
    );
    const row = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(result.lastInsertRowid);
    return row;
};

const updateSupplier = async (id, data) => {
    const fields = [];
    const values = [];

    if (data.name !== undefined)    { fields.push('name = ?');    values.push(data.name); }
    if (data.email !== undefined)   { fields.push('email = ?');   values.push(data.email); }
    if (data.phone !== undefined)   { fields.push('phone = ?');   values.push(data.phone); }
    if (data.address !== undefined) { fields.push('address = ?'); values.push(data.address); }

    if (fields.length === 0) return null;

    values.push(id);
    db.prepare(`UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    const row = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    return row || null;
};

const deleteSupplier = async (id) => {
    const row = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    if (!row) return null;
    db.prepare('DELETE FROM suppliers WHERE id = ?').run(id);
    return row;
};

module.exports = { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier };
