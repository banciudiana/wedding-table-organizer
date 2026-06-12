import express from 'express';
import * as tableController from '../controllers/tableController.js';

const router = express.Router();

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await tableController.getAllTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get table by number
router.get('/:tableNumber', async (req, res) => {
  try {
    const table = await tableController.getTableByNumber(parseInt(req.params.tableNumber));
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create table
router.post('/', async (req, res) => {
  try {
    const table = await tableController.createTable(req.body);
    res.status(201).json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update table
router.put('/:tableNumber', async (req, res) => {
  try {
    const table = await tableController.updateTable(parseInt(req.params.tableNumber), req.body);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add guest to table
router.post('/:tableNumber/guests', async (req, res) => {
  try {
    const table = await tableController.addGuestToTable(parseInt(req.params.tableNumber), req.body);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove guest from table
router.delete('/:tableNumber/guests/:guestName', async (req, res) => {
  try {
    const table = await tableController.removeGuestFromTable(
      parseInt(req.params.tableNumber),
      req.params.guestName
    );
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
