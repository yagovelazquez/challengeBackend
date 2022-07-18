const { User } = require("../models");
const { sequelize } = require("../models/index");

module.exports = {
  async login(req, res) {
    try {
      const { pin } = req.body;

      const dbUser = await User.findOne({
        include: [
          {
            association: "ClockTimes",
            attributes: [
              "clockIn",
              "clockOut",
              "breakBegin",
              "breakEnd",
              "comment",
              "changedBy",
            ],
            attributes: { exclude: ["id", "userId"] },
            model: sequelize.models.ClockTime,
          },
          {
            association: "Files",
            attributes: { exclude: ["userId", "id"] },
          },
        ],
        order: [["ClockTimes", "clockIn", "DESC"]],
        attributes: ["name", "occupation", "id"],
        where: { pin },
      });

      if (dbUser === null) {
        return res
          .status(401)
          .json({ error: "Could not find an user associated with this pin." });
      }

      const { id, name, occupation, ClockTimes, Files } = dbUser.dataValues;

      const token = User.generateAuthToken({ id });

      return res
        .header({ token: token.value })
        .json({
          name,
          occupation,
          clockTimes: ClockTimes,
          expiresIn: token.expiresIn,
          files: Files
        });
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
