module.exports = function (privillegeType) {
  return (req, res, next) => {
    if (req.user.type !== privillegeType)
      return res
        .status(401)
        .json({ error: "You're not authorized to access this route" });

    next();
  };
};
