const User = require("../models/User");

const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (req, res, next) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET
      ).toString(),
    });

    try {
      await newUser.save();
      res
        .status(201)
        .json({ status: true, message: "User Successfully Created" });
    } catch (error) {
      return next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "User Not Found" });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET
      ); // Decrypt the password
      const dectyptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (dectyptedString !== req.body.password) {
        return res
          .status(401)
          .json({ status: false, message: "Wrong Password" });
      }

      const userToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "21d" }
      );

      const user_id = user._id;

      res.status(200).json({ status: true, id: user._id, token: userToken });
    } catch (error) {
      return next(error);
    }
  },
};
