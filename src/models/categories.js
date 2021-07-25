'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categories.hasMany(models.expenses, { foreignKey: 'category_id', as: 'expenses', onDelete: 'SET NULL' });
      // categories.hasMany(models.months, { foreignKey: 'month_id', as: 'months', onDelete: 'SET NULL' });

    }
  };
  categories.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};