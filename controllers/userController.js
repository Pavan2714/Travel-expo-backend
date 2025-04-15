const User = require("../models/User");

module.exports = {
  deleteUser: async (req, res, next) => {
    try {
      await User.findByIdAndRemove(req.user.id);
      res
        .status(200)
        .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
      return next(error);
    }
  },

  getUser: async (req, res, next) => {
    const user_id = req.user.id;
    console.log(user_id);

    try {
      const user = await User.findById(user_id, {
        password: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      }).lean(); // ✅ convert to plain JS object

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "User does not exist" });
      }

      res.status(200).json(user); // ✅ safe now
    } catch (error) {
      return next(error);
    }
  },
};
