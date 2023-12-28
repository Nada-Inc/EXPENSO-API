// routes/variableExpense.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { isAuthenticated } = require('../middleware/auth');

// Get all VariableExpenses for a specific user
router.get('/getVariableExpense', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const variableExpenses = await prisma.variableExpense.findMany({
            where: { userId: userId },
        });
        res.json(variableExpenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create VariableExpense
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { expenseName, amount, date } = req.body;
        const variableExpense = await prisma.variableExpense.create({
            data: {
                expenseName,
                amount,
                date,
                userId,
            },
        });
        res.json(variableExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update VariableExpense
router.put('/update/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { expenseName, amount, date } = req.body;
        const updatedVariableExpense = await prisma.variableExpense.update({
            where: { id: id, userId: userId },
            data: {
                expenseName,
                amount,
                date,
            },
        });
        res.json(updatedVariableExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete VariableExpense
router.delete('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await prisma.variableExpense.deleteMany({
            where: { id: id, userId: userId },
        });
        res.json({ message: 'VariableExpense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete VariableExpense' });
    }
});

// Get a specific VariableExpense record by ID
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const variableExpense = await prisma.variableExpense.findUnique({
            where: { id: id, userId: userId },
        });
        if (!variableExpense) {
            return res.status(404).json({ message: 'VariableExpense not found' });
        }
        res.json(variableExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
