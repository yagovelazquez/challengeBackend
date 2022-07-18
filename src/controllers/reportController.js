const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models/index");

module.exports = {
  async getAllUserWorkedHours(req, res) {


    const totalHours = await sequelize.query(
      `select subq.Total_Hours_Worked*hourRate*0.9 as money_earned_after_taxes, subq.Total_Hours_Worked*hourRate as money_earned, subq.type as type, subq.Total_Hours_Worked as total_hours_worked, subq.Total_Hours_Break as total_hours_break,
       subq.occupation as occupation, subq.name as name, subq.hourRate as hourRate FROM 
       (select SUM(TIME_TO_SEC(TIMEDIFF(clockOut, clockIn))/3600) - SUM(
            CASE
            WHEN clockOut IS NOT NULL
            THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 END)
            ELSE 0
            END) as Total_Hours_Worked, type, occupation, name, hourRate,
            SUM(CASE
                WHEN clockOut IS NOT NULL
                THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 END)
                ELSE 0
                END) as Total_Hours_Break
            
            from clocktimes
            INNER JOIN users ON clocktimes.userId = users.id
            GROUP BY userId
            ORDER BY Total_Hours_Worked DESC) subq
            ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(totalHours);
  },

  async getTotalWorkedHours(req, res) {
    const { userId } = req.body;

    const [totalHours] = await sequelize.query(
      `select SUM(TIME_TO_SEC(TIMEDIFF(clockOut, clockIn))/3600) - SUM(
            CASE
            WHEN clockOut IS NOT NULL
            THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 END)
            ELSE 0
            END) as Total_Hours_Worked from clocktimes WHERE userId = ${userId};`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.send(totalHours);
  },

  async getTotalBreakTime(req, res) {
    const { userId } = req.body;

    const [totalHours] = await sequelize.query(
      `select SUM(
            CASE
            WHEN clockOut IS NOT NULL
            THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(breakEnd, breakBegin))/3600 END)
            ELSE 0
            END) as Total_Hours_Break from clocktimes WHERE userId = ${userId};`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.send(totalHours);
  },
};
