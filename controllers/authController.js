const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../data");

// Should be in env file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ||
  "e97b68923ab57d74c048b5472cec1e152a9b0c0483740ec19c61a8c4afdc6c5eb7abdeeb37bca7329a546cab00b97dfa08b5c2aa66d9b248785ab364b12b0a51";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, accessTokenSecret, {
    expiresIn: "1d",
  });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token should be like "Bearer token"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
  try {
    const { id } = jwt.verify(token, accessTokenSecret);

    // We should do something like this if we are using mongoose
    // const user = await User.findOne({ _id: id });

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized",
      });
    }
  } catch (e) {
    return res.status(403).json({
      status: "failed",
      message: "Unauthorized",
    });
  }
  next();
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // We should do something like this if we are using mongoose
    // const user = await User.findOne({ userName }).select('+password');

    const user = users.find((u) => u.userName === userName);

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "No user found",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken(user.id);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Something went wrong",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

module.exports = { loginUser, authenticateToken };
