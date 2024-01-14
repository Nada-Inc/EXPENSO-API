const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../../utils/ErrorHandler");
const { isAuthenticated } = require("../../middleware/auth");

router.post('/syncnotes', async (req, res) => {
    const { userId, notes } = req.body;
    
    try {
        // Perform upsert operation on user's notes
        const upsertedNote = await prisma.userNotes.upsert({
            where: {
                userId,
            },
            update: {
                notes,
                createdAt: new Date(),
            },
            create: {
                userId,
                notes,
                createdAt: new Date(),
            },
        });

        res.status(200).json(upsertedNote);
    } catch (error) {
        console.error('Error upserting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
