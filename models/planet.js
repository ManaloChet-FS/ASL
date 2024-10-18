'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Planet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Planet.belongsToMany(models.Star, {
        through: { 
          model: 'StarsPlanets',
          attributes: []
        }
      })
    }
  }
  Planet.init({
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    StarId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Planet',
  });
  return Planet;
};