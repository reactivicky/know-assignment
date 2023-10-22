const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Should be in env file
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ||
  "e97b68923ab57d74c048b5472cec1e152a9b0c0483740ec19c61a8c4afdc6c5eb7abdeeb37bca7329a546cab00b97dfa08b5c2aa66d9b248785ab364b12b0a51";

// Should be present in DB
const users = [
  {
    id: "asdfasdf8798asdf",
    userName: "Vignesh",
    password: "$2b$10$Fyg7V9U88yG89aVt5olndOM/aDpa6JgwVqMdvpDb1vmWUsuS4Lji2",
  },
  {
    id: "asdfasdf8798qwer",
    userName: "Vignesh1",
    password: "$2b$10$c/3OuIFj7NuCzIqGJwNWRuTII9ZQ/rvIVNamM9KaCeQ0RiuQr3WJi",
  },
  {
    id: "asdfasdf8798tyui",
    userName: "Vignesh2",
    password: "$2b$10$I7B26fA/v2LNS5Td5K91oeuF.McOrJ.bhqE89UFKbByQbtprv5cS2",
  },
];

const generateAccessToken = (id) => {
  return jwt.sign({ id }, accessTokenSecret, {
    expiresIn: "1d",
  });
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
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
