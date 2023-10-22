const fs = require("fs").promises;
const path = require("path");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    // We should do something like this if we are using mongoose
    // const user = await User.findById(id);
    const users = JSON.parse(
      await fs.readFile(path.join(__dirname, "../data.json"), "utf8")
    );
    const user = users.find((u) => u.id === id);
    // We can avoid selecting password in moongoose user schema
    delete user.password;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(404).json({
      status: "failed",
      message: `No user with id ${id}`,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, planet, designation } = req.body;
  try {
    // We should do something like this if we are using mongoose
    // const user = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const users = JSON.parse(
      await fs.readFile(path.join(__dirname, "../data.json"), "utf8")
    );
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        status: "failed",
        message: `No user with id ${id}`,
      });
    }
    users[userIndex] = {
      ...users[userIndex],
      firstName,
      lastName,
      planet,
      designation,
    };
    await fs.writeFile(
      path.join(__dirname, "../data.json"),
      JSON.stringify(users)
    );

    res.status(200).json({
      status: "success",
      data: {
        user: users[userIndex],
      },
    });
  } catch (e) {
    res.status(404).json({
      status: "failed",
      message: `No user with id ${id}`,
    });
  }
};

module.exports = { getUser, updateUser };
