const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    type: String,
    default:
      "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png",
  },
});

module.exports = mongoose.model("User", UserSchema);
