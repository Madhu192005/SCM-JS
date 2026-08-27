const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} = require('./supplier.queries');

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await getAllSuppliers();
        res.json({ suppliers });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch suppliers' });
    }
};

const getSupplier = async (req, res) => {
    try {
        const supplier = await getSupplierById(parseInt(req.params.id));
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        res.json({ supplier });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch supplier' });
    }
};

const addSupplier = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Supplier name is required' });
            return;
        }
        const supplier = await createSupplier({ name, email, phone, address });
        res.status(201).json({ message: 'Supplier created', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create supplier' });
    }
};

const editSupplier = async (req, res) => {
    try {
        const supplier = await updateSupplier(parseInt(req.params.id), req.body);
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        res.json({ message: 'Supplier updated', supplier });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update supplier' });
    }
};

const removeSupplier = async (req, res) => {
    try {
        const supplier = await deleteSupplier(parseInt(req.params.id));
        if (!supplier) {
            res.status(404).json({ message: 'Supplier not found' });
            return;
        }
        res.json({ message: 'Supplier deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete supplier' });
    }
};

module.exports = { getSuppliers, getSupplier, addSupplier, editSupplier, removeSupplier };
