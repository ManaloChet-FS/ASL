'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('galaxies', 'image', { 
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('planets', 'image', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.addColumn('stars', 'image', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('galaxies', 'image');
    await queryInterface.removeColumn('planets', 'image');
    await queryInterface.removeColumn('stars', 'image');
  }
};
