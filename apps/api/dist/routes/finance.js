"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = financeRoutes;
const express_1 = __importDefault(require("express"));
function financeRoutes(storage) {
    const router = express_1.default.Router();
    // Chart of Accounts
    router.get('/accounts', async (_req, res) => {
        try {
            const accounts = await storage.readAll('finance/accounts');
            res.json(accounts);
        }
        catch (error) {
            console.error('Failed to fetch accounts:', error);
            res.status(500).json({ error: 'Failed to fetch accounts' });
        }
    });
    router.post('/accounts', async (req, res) => {
        try {
            const account = req.body;
            if (!account.id || !account.name) {
                return res.status(400).json({ error: 'Account id and name are required' });
            }
            await storage.write('finance/accounts', account.id, account);
            res.status(201).json(account);
        }
        catch (error) {
            console.error('Failed to create account:', error);
            res.status(500).json({ error: 'Failed to create account' });
        }
    });
    // Transactions
    router.get('/transactions', async (_req, res) => {
        try {
            const transactions = await storage.readAll('finance/transactions');
            res.json(transactions);
        }
        catch (error) {
            console.error('Failed to fetch transactions:', error);
            res.status(500).json({ error: 'Failed to fetch transactions' });
        }
    });
    router.post('/transactions', async (req, res) => {
        try {
            const transaction = req.body;
            if (!transaction.id || !transaction.amount) {
                return res.status(400).json({ error: 'Transaction id and amount are required' });
            }
            await storage.write('finance/transactions', transaction.id, transaction);
            res.status(201).json(transaction);
        }
        catch (error) {
            console.error('Failed to create transaction:', error);
            res.status(500).json({ error: 'Failed to create transaction' });
        }
    });
    // Invoices
    router.get('/invoices', async (_req, res) => {
        try {
            const invoices = await storage.readAll('finance/invoices');
            res.json(invoices);
        }
        catch (error) {
            console.error('Failed to fetch invoices:', error);
            res.status(500).json({ error: 'Failed to fetch invoices' });
        }
    });
    router.post('/invoices', async (req, res) => {
        try {
            const invoice = req.body;
            if (!invoice.id || !invoice.amount || !invoice.customer) {
                return res.status(400).json({ error: 'Invoice id, amount, and customer are required' });
            }
            await storage.write('finance/invoices', invoice.id, invoice);
            res.status(201).json(invoice);
        }
        catch (error) {
            console.error('Failed to create invoice:', error);
            res.status(500).json({ error: 'Failed to create invoice' });
        }
    });
    return router;
}
