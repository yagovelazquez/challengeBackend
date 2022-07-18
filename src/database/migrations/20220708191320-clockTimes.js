"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("clockTimes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment: {
        type: Sequelize.STRING,
      },
      clockIn: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      clockOut: {
        type: Sequelize.DATE,
      },
      breakBegin: {
        type: Sequelize.DATE,
      },
      breakEnd: {
        type: Sequelize.DATE,
      },
      changedBy: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE"
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("clockTimes");
  },
};
