const users = require("../data");

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    // We should do something like this if we are using mongoose
    // const user = await User.findById(id);
    const user = users.find((u) => u.id === id);
    // We can avoid selecting password in moongoose user schema
    delete user.password;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (exports) {
    res.status(404).json({
      status: "failed",
      message: `No user with id ${id}`,
    });
  }
};

const updateUser = () => {};

module.exports = { getUser, updateUser };
