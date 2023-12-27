const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    res.status(200).json({ Expenso: 'working...' });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// Get all records
router.get('/getAllRecords', async (req, res) => {
  try {
    const allRecords = await prisma.testTable.findMany();
    res.status(200).json(allRecords);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// Create a new record
router.post('/addRecord', async (req, res) => {
  const { name, age } = req.body;

  try {
    const newRecord = await prisma.testTable.create({
      data: {
        name,
        age,
      },
    });
    res.status(200).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error adding record' });
  }
});

// Update a record
router.put('/updateRecord/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  try {
    const updatedRecord = await prisma.testTable.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        age,
      },
    });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error updating record' });
  }
});

// Delete a record
router.delete('/deleteRecord/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.testTable.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting record' });
  }
});

// test('sample test', () => {
//   expect(true).toBe(true);
// });

module.exports = router;