// create token and saving that in cookies
const jwt = require("jsonwebtoken");
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });

  // Options for cookies
  // const options = {
  //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   sameSite: "none",
  //   secure: true,
  // };

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      userName: user.userName,
      email: user.email,
      // Include other user fields if needed
    },
  });
};

module.exports = sendToken;
