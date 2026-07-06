import express from 'express';
import { StorageEngine } from '../storage-engine';

export default function inventoryRoutes(storage: StorageEngine) {
  const router = express.Router();

  // Products
  router.get('/products', async (_req, res) => {
    try {
      const products = await storage.readAll('inventory/products');
      res.json(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  router.post('/products', async (req, res) => {
    try {
      const product = req.body;
      if (!product.id || !product.name) {
        return res.status(400).json({ error: 'Product id and name are required' });
      }
      await storage.write('inventory/products', product.id, product);
      res.status(201).json(product);
    } catch (error) {
      console.error('Failed to create product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Warehouses
  router.get('/warehouses', async (_req, res) => {
    try {
      const warehouses = await storage.readAll('inventory/warehouses');
      res.json(warehouses);
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      res.status(500).json({ error: 'Failed to fetch warehouses' });
    }
  });

  router.post('/warehouses', async (req, res) => {
    try {
      const warehouse = req.body;
      if (!warehouse.id || !warehouse.name) {
        return res.status(400).json({ error: 'Warehouse id and name are required' });
      }
      await storage.write('inventory/warehouses', warehouse.id, warehouse);
      res.status(201).json(warehouse);
    } catch (error) {
      console.error('Failed to create warehouse:', error);
      res.status(500).json({ error: 'Failed to create warehouse' });
    }
  });

  // Stock
  router.get('/stock', async (_req, res) => {
    try {
      const stock = await storage.readAll('inventory/stock');
      res.json(stock);
    } catch (error) {
      console.error('Failed to fetch stock:', error);
      res.status(500).json({ error: 'Failed to fetch stock' });
    }
  });

  router.post('/stock/movements', async (req, res) => {
    try {
      const movement = req.body;
      if (!movement.id || !movement.productId || !movement.quantity) {
        return res.status(400).json({ error: 'Movement id, productId, and quantity are required' });
      }
      await storage.write('inventory/movements', movement.id, movement);
      res.status(201).json(movement);
    } catch (error) {
      console.error('Failed to record stock movement:', error);
      res.status(500).json({ error: 'Failed to record stock movement' });
    }
  });

  return router;
}
