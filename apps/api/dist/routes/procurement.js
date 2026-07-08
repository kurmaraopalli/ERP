"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = procurementRoutes;
const express_1 = __importDefault(require("express"));
function procurementRoutes(storage) {
    const router = express_1.default.Router();
    // Vendors
    router.get('/vendors', async (_req, res) => {
        try {
            const vendors = await storage.readAll('procurement/vendors');
            res.json(vendors);
        }
        catch (error) {
            console.error('Failed to fetch vendors:', error);
            res.status(500).json({ error: 'Failed to fetch vendors' });
        }
    });
    router.post('/vendors', async (req, res) => {
        try {
            const vendor = req.body;
            if (!vendor.id || !vendor.name) {
                return res.status(400).json({ error: 'Vendor id and name are required' });
            }
            await storage.write('procurement/vendors', vendor.id, vendor);
            res.status(201).json(vendor);
        }
        catch (error) {
            console.error('Failed to create vendor:', error);
            res.status(500).json({ error: 'Failed to create vendor' });
        }
    });
    // Purchase Orders
    router.get('/purchase-orders', async (_req, res) => {
        try {
            const orders = await storage.readAll('procurement/purchase-orders');
            res.json(orders);
        }
        catch (error) {
            console.error('Failed to fetch purchase orders:', error);
            res.status(500).json({ error: 'Failed to fetch purchase orders' });
        }
    });
    router.post('/purchase-orders', async (req, res) => {
        try {
            const order = req.body;
            if (!order.id || !order.vendorId) {
                return res.status(400).json({ error: 'Purchase order id and vendorId are required' });
            }
            await storage.write('procurement/purchase-orders', order.id, order);
            res.status(201).json(order);
        }
        catch (error) {
            console.error('Failed to create purchase order:', error);
            res.status(500).json({ error: 'Failed to create purchase order' });
        }
    });
    // Purchase Requisitions
    router.get('/requisitions', async (_req, res) => {
        try {
            const requisitions = await storage.readAll('procurement/requisitions');
            res.json(requisitions);
        }
        catch (error) {
            console.error('Failed to fetch requisitions:', error);
            res.status(500).json({ error: 'Failed to fetch requisitions' });
        }
    });
    router.post('/requisitions', async (req, res) => {
        try {
            const requisition = req.body;
            if (!requisition.id || !requisition.description) {
                return res.status(400).json({ error: 'Requisition id and description are required' });
            }
            await storage.write('procurement/requisitions', requisition.id, requisition);
            res.status(201).json(requisition);
        }
        catch (error) {
            console.error('Failed to create requisition:', error);
            res.status(500).json({ error: 'Failed to create requisition' });
        }
    });
    return router;
}
