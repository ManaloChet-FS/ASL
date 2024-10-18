'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Stars');
  }
};