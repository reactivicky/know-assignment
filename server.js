const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

const corsOptions = {
  origin: "http://localhost:3000",
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1/user/auth", authRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
