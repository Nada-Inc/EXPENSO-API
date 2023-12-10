const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

// Create fixedIncome
router.post('/add',isAuthenticated, async (req, res) => {
  try {
    const  userId= req.user.id
    const { incomeName, amount, creditDate } = req.body;
    const fixedIncome = await prisma.fixedIncome.create({
      data: {
        incomeName,
        userId,
        amount,
        creditDate,
      },
    });
    res.json(fixedIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update fixedIncome
router.put('/update', isAuthenticated, async (req, res) => {
  try {
    const  userId= req.user.id
    const { incomeName, id, amount, creditDate } = req.body;
    const updatedfixedIncome = await prisma.fixedIncome.update({
      where: { id: id },
      data: {
        incomeName,
        userId,
        amount,
        creditDate,
      },
    });
    res.json(updatedfixedIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete fixedIncome
router.delete('/delete', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.body;
    await prisma.fixedIncome.delete({
      where: { id: id  },
    });
    res.json({ message: 'fixedIncome deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete fixedIncome' });
  }
});

module.exports = router;
