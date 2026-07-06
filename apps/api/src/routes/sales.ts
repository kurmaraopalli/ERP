import express from 'express';
import { StorageEngine } from '../storage-engine';

export default function salesRoutes(storage: StorageEngine) {
  const router = express.Router();

  // Customers
  router.get('/customers', async (_req, res) => {
    try {
      const customers = await storage.readAll('sales/customers');
      res.json(customers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  });

  router.post('/customers', async (req, res) => {
    try {
      const customer = req.body;
      if (!customer.id || !customer.name) {
        return res.status(400).json({ error: 'Customer id and name are required' });
      }
      await storage.write('sales/customers', customer.id, customer);
      res.status(201).json(customer);
    } catch (error) {
      console.error('Failed to create customer:', error);
      res.status(500).json({ error: 'Failed to create customer' });
    }
  });

  // Sales Orders
  router.get('/orders', async (_req, res) => {
    try {
      const orders = await storage.readAll('sales/orders');
      res.json(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  router.post('/orders', async (req, res) => {
    try {
      const order = req.body;
      if (!order.id || !order.customerId) {
        return res.status(400).json({ error: 'Order id and customerId are required' });
      }
      await storage.write('sales/orders', order.id, order);
      res.status(201).json(order);
    } catch (error) {
      console.error('Failed to create order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Quotes
  router.get('/quotes', async (_req, res) => {
    try {
      const quotes = await storage.readAll('sales/quotes');
      res.json(quotes);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
      res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  });

  router.post('/quotes', async (req, res) => {
    try {
      const quote = req.body;
      if (!quote.id || !quote.customerId) {
        return res.status(400).json({ error: 'Quote id and customerId are required' });
      }
      await storage.write('sales/quotes', quote.id, quote);
      res.status(201).json(quote);
    } catch (error) {
      console.error('Failed to create quote:', error);
      res.status(500).json({ error: 'Failed to create quote' });
    }
  });

  return router;
}
