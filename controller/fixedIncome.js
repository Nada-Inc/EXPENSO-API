const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

// Create FixedIncomeItem
router.post('/addItem',isAuthenticated, async (req, res) => {
  try {
    const  userId= req.user.id
    const { incomeName, amount, creditedDay } = req.body;
    const fixedIncomeItem = await prisma.fixedIncomeItem.create({
      data: {
        incomeName,
        userId,
        amount,
        creditedDay,
      },
    });
    res.json(fixedIncomeItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update FixedIncomeItem
router.put('/updateItem', isAuthenticated, async (req, res) => {
  try {
    const  userId= req.user.id
    const { incomeName, id, amount, creditedDay } = req.body;
    const updatedFixedIncomeItem = await prisma.fixedIncomeItem.update({
      where: { id: parseInt(id) },
      data: {
        incomeName,
        userId,
        amount,
        creditedDay,
      },
    });
    res.json(updatedFixedIncomeItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete FixedIncomeItem
router.delete('/deleteItem', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    await prisma.fixedIncomeItem.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'FixedIncomeItem deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete FixedIncomeItem' });
  }
});

module.exports = router;
