const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./modules/auth/auth.routes');
const { errorHandler } = require('./middleware/error.middleware');
const inventoryRoutes = require('./modules/inventory/inventory.routes');
const supplierRoutes = require('./modules/suppliers/supplier.routes');
const analyticsRoutes = require('./modules/analytics/analytics.routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Test DB connection
try {
    const row = db.prepare("SELECT datetime('now') AS now").get();
    console.log('✅ DB connected at:', row.now);
} catch (err) {
    console.error('❌ DB connection failed:', err);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Supply Chain API running', health: '/api/health' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Supply Chain API running' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
