const { Model } = require("sequelize");
const Joi = require("joi");
const { privateJwtKey} = require("../config/app")
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.ClockTime, {
        foreignKey: "userId",
        as: "ClockTimes",
      });
      this.hasMany(models.File, {
        foreignKey: "userId",
        as: "Files",
      });
    }

    static generateAuthToken = function ({ id,type }) {
      const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60;
      const token = jwt.sign(
        { id, exp: expiresIn, type },
        privateJwtKey
      );
      return { value: token, expiresIn };
    };
  }

  User.init(
    {
      name: DataTypes.STRING,
      occupation: DataTypes.STRING,
      hourRate: DataTypes.DECIMAL,
      pin: DataTypes.NUMBER,
      type: { type: DataTypes.ENUM("normal", "admin"), defaultValue: "normal" },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );

  

  return User;
};

