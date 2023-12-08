const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new ErrorHandler("Please provide a valid token", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};
