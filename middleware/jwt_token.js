const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "Not Valid Token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
};

module.exports = { verifyToken };
