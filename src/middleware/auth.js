const jwt = require("jsonwebtoken");
const { privateJwtKey} = require("../config/app")

module.exports = function (req, res, next) {



  const token = req.header("token");
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, privateJwtKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};
