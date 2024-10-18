'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Stars', 'GalaxyId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Galaxies'
        },
        key: 'id'
      },
      allowNull: true
    })
    await queryInterface.addColumn('Stars', 'PlanetId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Planets'
        },
        key: 'id'
      },
      allowNull: true
    })
    await queryInterface.addColumn('Planets', 'StarId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'Stars'
        },
        key: 'id'
      },
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Stars', 'GalaxyId');
    await queryInterface.removeColumn('Stars', 'PlanetId');
    await queryInterface.removeColumn('Planets', 'StarId');
  }
};
