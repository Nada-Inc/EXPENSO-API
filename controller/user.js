const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");

// create user
router.post("/createUser", async (req, res, next) => {
  try {
    const {
      userName,
      password,
      email,
      phoneNumber,
      currency,
      country,
      subscriptionType,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      userName,
      password: hashedPassword,
      email,
      phoneNumber,
      currency,
      country,
      subscriptionType,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:${process.env.PORT}/user/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `<h1 style="color: blue;">Hello ${user.userName},</h1>
          <p>Please click on the link to activate your account:</p>
          <a href="${activationUrl}">Click Here</a>`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.get(
  "/activation/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const activation_token = req.params.id;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const {
        userName,
        password,
        email,
        phoneNumber,
        currency,
        country,
        subscriptionType,
      } = newUser;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return next(new ErrorHandler("User already registered", 400));
      }

      const createdUser = await prisma.user.create({
        data: {
          userName,
          password,
          email,
          phoneNumber,
          currency,
          country,
          subscriptionType,
        },
      });

      sendToken(createdUser, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user information
router.put(
  "/updateUser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        userName,
        email,
        phoneNumber,
        currency,
        country,
        subscriptionType,
      } = req.body;

      const updatedUser = await prisma.user.update({
        where: {
          id: req.user.id, // Access user ID from req.user
        },
        data: {
          userName,
          email,
          phoneNumber,
          currency,
          country,
          subscriptionType,
        },
      });

      res.status(200).json({ success: true, user: req.body });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user information
router.get(
  "/getUser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id, // Access user ID from req.user
        },
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/loginUser",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Logout user 
router.get("/logout", isAuthenticated, (req, res) => {
  // Perform logout actions here.
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// Change user password
router.put(
  "/changePassword",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id, // Access user ID from req.user
        },
      });

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return next(new ErrorHandler("Incorrect current password", 400));
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: req.user.id, // Access user ID from req.user
        },
        data: {
          password: hashedNewPassword,
        },
      });

      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
