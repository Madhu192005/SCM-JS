const db = require('../../config/database');

const getAnalytics = async (req, res) => {
    try {
        // Total products count
        const totalProducts = db.prepare('SELECT COUNT(*) AS count FROM products').get();

        // Total inventory value
        const totalValue = db.prepare(
            'SELECT COALESCE(SUM(quantity * unit_price), 0) AS total FROM products'
        ).get();

        // Low stock count
        const lowStock = db.prepare(
            'SELECT COUNT(*) AS count FROM products WHERE quantity <= min_threshold'
        ).get();

        // Total suppliers
        const totalSuppliers = db.prepare('SELECT COUNT(*) AS count FROM suppliers').get();

        // Total active users
        const totalUsers = db.prepare(
            'SELECT COUNT(*) AS count FROM users WHERE is_active = 1'
        ).get();

        // Top 5 low stock products
        const lowStockProducts = db.prepare(`
            SELECT name, sku, quantity, min_threshold
            FROM products
            WHERE quantity <= min_threshold
            ORDER BY quantity ASC
            LIMIT 5
        `).all();

        // Products by category
        const byCategory = db.prepare(`
            SELECT category, COUNT(*) AS count,
                   SUM(quantity * unit_price) AS value
            FROM products
            GROUP BY category
            ORDER BY count DESC
        `).all();

        // Recent stock activity (last 7 days)
        const recentActivity = db.prepare(`
            SELECT
                date(created_at) AS date,
                COUNT(*) AS transactions,
                SUM(CASE WHEN change_amount > 0 THEN change_amount ELSE 0 END) AS stock_in,
                SUM(CASE WHEN change_amount < 0 THEN ABS(change_amount) ELSE 0 END) AS stock_out
            FROM stock_log
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY date(created_at)
            ORDER BY date ASC
        `).all();

        res.json({
            summary: {
                total_products:  totalProducts.count,
                total_value:     totalValue.total,
                low_stock_count: lowStock.count,
                total_suppliers: totalSuppliers.count,
                total_users:     totalUsers.count
            },
            low_stock_products: lowStockProducts,
            by_category:        byCategory,
            recent_activity:    recentActivity
        });
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ message: 'Failed to fetch analytics' });
    }
};

module.exports = { getAnalytics };
