const { Model, DataTypes } = require("sequelize");

const Joi = require("joi");

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId", as: "User" });
    }
  }

  File.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      key: {
        type: DataTypes.STRING,
      },
      size: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    },

    {
      timestamps: false,
      sequelize,
      tableName: "files",
      modelName: "File",
    }
  );

  return File;
};



