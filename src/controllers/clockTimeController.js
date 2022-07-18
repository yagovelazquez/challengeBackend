const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models/index");
const { ClockTime } = require("../models");
const { User } = require("../models");

module.exports = {
  async storeClockIn(req, res) {
    const { id } = req.user;
    const { comment } = req.body;
    const userDb = await User.findOne({ where: { id } });
    if (!userDb)
      return res.status(400).json({ error: "Could not find this user" });

    const newClockTimeDb = await ClockTime.create({
      userId: id,
      comment,
      clockOut: null,
      breakBegin: null,
      breakEnd: null,
      changedBy: null,
    });

    const {
      id: notUsedId,
      userId: notUsedUserId,
      ...newClockTime
    } = newClockTimeDb.dataValues;

    res.json(newClockTime);
  },

  async getAllClocks(req, res) {
    const clocks = await ClockTime.findAll({
      order: [["clockIn", "DESC"]],
      attributes: { exclude: ["id", "userId"] },
    });

    res.send(clocks);
  },
  async getUserClocks(req, res) {
    const { id } = req.user;

    const clocks = await ClockTime.findAll({
      order: [["clockIn", "DESC"]],
      where: { userId: id },
      attributes: { exclude: ["id", "userId"] },
    });

    res.send(clocks);
  },

  async storeOtherClocks(req, res) {
    const { clockType, comment } = req.body;
    const { id: userId } = req.user;

    const userDb = await User.findOne({
      where: { id: userId },
      include: [
        { association: "ClockTimes", limit: 1, order: [["clockIn", "DESC"]] },
      ],
    });

    if (!userDb)
      return res
        .status(400)
        .json({ error: "Could not find user with this pin value" });

    const clockTimesDb = userDb.ClockTimes[0].dataValues;

    if (clockTimesDb[clockType])
      return res.status(400).json({ error: "You cannot clock on twice" });

    if (clockType !== "clockOut")  {
      if (clockTimesDb.clockOut) return res.status(400).json({ error: "You cannot initiate/finish break after clocking out" });
    }

    await ClockTime.update(
      { [clockType]: sequelize.fn("NOW"), comment },
      { where: { id: clockTimesDb.id } }
    );

    const updatedStoredClockTime = await ClockTime.findByPk(clockTimesDb.id, {
      attributes: { exclude: ["id", "userId"] },
    });

    res.send(updatedStoredClockTime);
  },

};


