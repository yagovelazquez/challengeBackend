const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models/index");

module.exports = {
  async getAllUserWorkedHours(req, res) {
    const totalHours = await sequelize.query(
      `select subq.Total_Hours_Worked*hourRate*0.9 as money_earned_after_taxes, subq.Total_Hours_Worked*hourRate as money_earned, subq.type as type, subq.Total_Hours_Worked as total_hours_worked, subq.Total_Hours_Break as total_hours_break,
       subq.occupation as occupation, subq.name as name, subq.hourRate as hourRate FROM 
       (select SUM(CASE WHEN (TIME_TO_SEC(TIMEDIFF(clockOut, clockIn))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(clockOut, clockIn))/3600  END) - SUM(
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
            RIGHT JOIN users ON clocktimes.userId = users.id
            GROUP BY users.id
            ORDER BY Total_Hours_Worked DESC) subq
            ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json(totalHours);
  },

  async getUserTotalWorkedHours(req, res) {
    const { id: userId } = req.user;


    const totalHours = await sequelize.query(
      `select subq.Total_Hours_Worked*hourRate*0.9 as money_earned_after_taxes, subq.Total_Hours_Worked*hourRate as money_earned, subq.type as type, subq.Total_Hours_Worked as total_hours_worked, subq.Total_Hours_Break as total_hours_break,
         subq.occupation as occupation, subq.name as name, subq.hourRate as hourRate FROM 
         (select SUM(CASE WHEN (TIME_TO_SEC(TIMEDIFF(c.clockOut, c.clockIn))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(c.clockOut, c.clockIn))/3600  END) - SUM(
              CASE
              WHEN c.clockOut IS NOT NULL
              THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(c.breakEnd, c.breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(c.breakEnd, c.breakBegin))/3600 END)
              ELSE 0
              END) as Total_Hours_Worked, u.type, u.occupation, u.name, u.hourRate,
              SUM(CASE
                  WHEN clockOut IS NOT NULL
                  THEN (CASE WHEN (TIME_TO_SEC(TIMEDIFF(c.breakEnd, c.breakBegin))/3600 IS NULL) THEN 0 ELSE TIME_TO_SEC(TIMEDIFF(c.breakEnd, c.breakBegin))/3600 END)
                  ELSE 0
                  END) as Total_Hours_Break
              
              from clocktimes c
              RIGHT JOIN users u ON u.id = c.userId
              WHERE u.id = ${userId}    
              ) subq
              ;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.send(totalHours);
  },
};
