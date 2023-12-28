// routes/fixedExpense.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { isAuthenticated } = require('../middleware/auth');

// Create FixedExpense
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { expenseName, amount, debitDate } = req.body;
        const fixedExpense = await prisma.fixedExpense.create({
            data: {
                expenseName,
                amount,
                debitDate,
                userId,
            },
        });
        res.json(fixedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update FixedExpense
router.put('/update/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { expenseName, amount, debitDate } = req.body;
        const updatedFixedExpense = await prisma.fixedExpense.update({
            where: { id: id, userId: userId },
            data: {
                expenseName,
                amount,
                debitDate,
            },
        });
        res.json(updatedFixedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete FixedExpense
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await prisma.fixedExpense.deleteMany({
            where: { id: id, userId: userId },
        });
        res.json({ message: 'FixedExpense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete FixedExpense' });
    }
});

// Get all FixedExpense records for a specific user
router.get('/getfixedexpense', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const fixedExpenses = await prisma.fixedExpense.findMany({
            where: { userId: userId },
        });
        res.json(fixedExpenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific FixedExpense record by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const fixedExpense = await prisma.fixedExpense.findUnique({
            where: { id: id, userId: userId },
        });
        if (!fixedExpense) {
            return res.status(404).json({ message: 'FixedExpense not found' });
        }
        res.json(fixedExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
