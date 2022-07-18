const { Model, DataTypes } = require("sequelize");
const Joi = require("joi");

module.exports = (sequelize, DataTypes) => {
  class ClockTime extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "User" });
    }
  }

  ClockTime.init(
    {
      userId: DataTypes.STRING,
      clockIn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      clockOut: {
        type: DataTypes.DATE
      },
      breakBegin: {
        type: DataTypes.DATE
      },
      breakEnd: {
        type: DataTypes.DATE
      },
      comment: DataTypes.STRING,
    },
    {
      timestamps: false,
      sequelize,
      tableName: "clocktimes",
      modelName: "ClockTime",
    }
  );

  return ClockTime;
};


