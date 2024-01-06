const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendToken = require("../../utils/jwtToken");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");

router.post("/createNoteUser", async (req, res, next) => {
    try {
        const {
            userName,
            userId,
            password,
            email,
        } = req.body;

        const existingUser = await prisma.noteUser.findUnique({
            where: {
                userId,
            },
        });

        if (existingUser) {
            return next(new ErrorHandler("UserName already exists", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.noteUser.create({
            data: {
                userName,
                userId,
                password: hashedPassword,
                email,
            },
        });

        sendToken(user, 201, res);

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

router.post("/loginNoteUser", async (req, res, next) => {
    try {
        const { userId, password } = req.body;

        const user = await prisma.noteUser.findUnique({
            where: {
                userId,
            },
        });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new ErrorHandler("Invalid password", 401));
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.ACTIVATION_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: `User logged in successfully`,
            token,
            userName: user.userName,
            userId: user.userId,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

module.exports = router;
