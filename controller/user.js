const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
// const { isAuthenticated} = require("../middleware/auth");

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

    const user = await prisma.user.create({
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

    // const activationToken = createActivationToken(user);

    // const activationUrl = `http://localhost:${process.env.PORT}/user/activation/${activationToken}`;

    // try {
    //   await sendMail({
    //     email: user.email,
    //     subject: "Activate your account",
    //     message: `<h1 style="color: blue;">Hello ${user.userName},</h1>
    //       <p>Please click on the link to activate your account:</p>
    //       <a href="${activationUrl}">${activationUrl}</a>`,
    //   });
    //   res.status(201).json({
    //     success: true,
    //     message: `please check your email:- ${user.email} to activate your account!`,
    //   });
    // } catch (error) {
    //   return next(new ErrorHandler(error.message, 500));
    // }
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
// router.post(
//   "/activation",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { activation_token } = req.body;

//       const newUser = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET
//       );

//       if (!newUser) {
//         return next(new ErrorHandler("Invalid token", 400));
//       }
//       const { userName, email, password } = newUser;

//       const existingUser = await prisma.user.findUnique({
//         where: {
//           email,
//         },
//       });

//       if (existingUser) {
//         return next(new ErrorHandler("User already exists", 400));
//       }

//       const createdUser = await prisma.user.create({
//         data: {
//           userName,
//           password,
//           email,
//           phoneNumber,
//           currency,
//           country,
//           subscriptionType,
//         },
//       });

//       sendToken(createdUser, 201, res);
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

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

      if (!(user.password == password)) {
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

module.exports = router;