const db = require('../../config/database');

const findUserByEmail = async (email) => {
    const row = db.prepare(
        'SELECT * FROM users WHERE email = ? AND is_active = 1'
    ).get(email);
    return row || null;
};

const findUserById = async (id) => {
    const row = db.prepare(
        'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?'
    ).get(id);
    return row || null;
};

const createUser = async (name, email, hashedPassword, role) => {
    const stmt = db.prepare(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
    );
    const result = stmt.run(name, email, hashedPassword, role);
    const user = db.prepare(
        'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?'
    ).get(result.lastInsertRowid);
    return user;
};

const getAllUsers = async () => {
    const rows = db.prepare(
        'SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
    ).all();
    return rows;
};

const toggleUserStatus = async (id) => {
    db.prepare(
        'UPDATE users SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?'
    ).run(id);
    const row = db.prepare(
        'SELECT id, name, email, role, is_active FROM users WHERE id = ?'
    ).get(id);
    return row || null;
};

module.exports = { findUserByEmail, findUserById, createUser, getAllUsers, toggleUserStatus };
