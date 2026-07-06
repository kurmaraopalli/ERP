import express from 'express';
import { StorageEngine } from '../storage-engine';

export default function hrRoutes(storage: StorageEngine) {
  const router = express.Router();

  // Employees
  router.get('/employees', async (_req, res) => {
    try {
      const employees = await storage.readAll('hr/employees');
      res.json(employees);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  });

  router.post('/employees', async (req, res) => {
    try {
      const employee = req.body;
      if (!employee.id || !employee.name || !employee.email) {
        return res.status(400).json({ error: 'Employee id, name, and email are required' });
      }
      await storage.write('hr/employees', employee.id, employee);
      res.status(201).json(employee);
    } catch (error) {
      console.error('Failed to create employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    }
  });

  // Departments
  router.get('/departments', async (_req, res) => {
    try {
      const departments = await storage.readAll('hr/departments');
      res.json(departments);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      res.status(500).json({ error: 'Failed to fetch departments' });
    }
  });

  router.post('/departments', async (req, res) => {
    try {
      const department = req.body;
      if (!department.id || !department.name) {
        return res.status(400).json({ error: 'Department id and name are required' });
      }
      await storage.write('hr/departments', department.id, department);
      res.status(201).json(department);
    } catch (error) {
      console.error('Failed to create department:', error);
      res.status(500).json({ error: 'Failed to create department' });
    }
  });

  // Payroll
  router.get('/payroll', async (_req, res) => {
    try {
      const payroll = await storage.readAll('hr/payroll');
      res.json(payroll);
    } catch (error) {
      console.error('Failed to fetch payroll:', error);
      res.status(500).json({ error: 'Failed to fetch payroll' });
    }
  });

  router.post('/payroll', async (req, res) => {
    try {
      const payroll = req.body;
      if (!payroll.id || !payroll.employeeId || !payroll.amount) {
        return res.status(400).json({ error: 'Payroll id, employeeId, and amount are required' });
      }
      await storage.write('hr/payroll', payroll.id, payroll);
      res.status(201).json(payroll);
    } catch (error) {
      console.error('Failed to create payroll:', error);
      res.status(500).json({ error: 'Failed to create payroll' });
    }
  });

  // Leave Requests
  router.get('/leave-requests', async (_req, res) => {
    try {
      const requests = await storage.readAll('hr/leave-requests');
      res.json(requests);
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
      res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
  });

  router.post('/leave-requests', async (req, res) => {
    try {
      const request = req.body;
      if (!request.id || !request.employeeId || !request.startDate || !request.endDate) {
        return res.status(400).json({ error: 'Leave request id, employeeId, startDate, and endDate are required' });
      }
      await storage.write('hr/leave-requests', request.id, request);
      res.status(201).json(request);
    } catch (error) {
      console.error('Failed to create leave request:', error);
      res.status(500).json({ error: 'Failed to create leave request' });
    }
  });

  return router;
}
