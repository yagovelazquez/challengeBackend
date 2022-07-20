const { User } = require("../models");

module.exports = {
  async storeUser(req, res) {
    const { name, occupation, hourRate } = req.body;
    let doesPinExists = true;
    let pin;
    while (doesPinExists === true) {
      pin = Math.floor(Math.random() * (99999 - 10000)) + 10000;
      const userPinDb = await User.findOne({ where: { pin } });
      if (!userPinDb) {
        doesPinExists = false;
      }
    }

    const newUser = await User.create({
      name,
      occupation,
      pin,
      hourRate
    });

    res.send(newUser);
  },

  async updateUser(req, res) {
    const { id: userId } = req.user;

    const userDb = await User.findOne({ where: { id: userId } });

    if (!userDb)
      return res.status(400).json({ error: "Could not find this user" });

    await User.update(
      { ...req.body },
      {
        where: {
          id: userId,
        },
      }
    );

    res.json({ message: "successfully updated!" });
  },

  async getUser(req, res) {
    const { id, exp } = req.user;

    try {
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
          },
          {
            association: "Files",
            attributes: { exclude: ["userId", "id"] },
          },
        ],
        attributes: ["name","type", "occupation", "id"],
        order: [["ClockTimes", "clockIn", "DESC"]],
        where: { id },
      });

      const { name, occupation, ClockTimes, Files, type } = dbUser.dataValues;

      res.json({
        name,
        occupation,
        type,
        clockTimes: ClockTimes,
        expiresIn: exp,
        files: Files,
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getAllUsers(req, res) {


    try {
      const dbUser = await User.findAll({
        attributes: {exclude: ["updatedAt","id"]},
        order: [["name", "ASC"]],
      });

      res.json(dbUser);
    } catch (error) {
      console.log(error);
    }
  },
};
