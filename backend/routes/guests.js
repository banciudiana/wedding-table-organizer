import express from 'express';
import * as guestController from '../controllers/guestController.js';
import * as tableController from '../controllers/tableController.js';

const router = express.Router();

// Find guest by name (searches in Table.guests array)
router.get('/search/:name', async (req, res) => {
  try {
    const guest = await tableController.findGuestByName(req.params.name);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all guests
router.get('/', async (req, res) => {
  try {
    const guests = await guestController.getAllGuests();
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create guest
router.post('/', async (req, res) => {
  try {
    const guest = await guestController.createGuest(req.body);
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update guest
router.put('/:id', async (req, res) => {
  try {
    const guest = await guestController.updateGuest(req.params.id, req.body);
    res.json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete guest
router.delete('/:id', async (req, res) => {
  try {
    await guestController.deleteGuest(req.params.id);
    res.json({ message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
