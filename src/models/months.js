'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class months extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      months.hasMany(models.incomes, { foreignKey: 'month_id', as: 'incomes', onDelete: 'SET NULL' });
      // models.incomes.belongsTo(models.months, { foreignKey: 'month_id', as: 'months', onDelete: 'SET NULL' });
      months.hasMany(models.expenses, { foreignKey: 'month_id', as: 'expenses', onDelete: 'SET NULL' });
      // months.belongsToMany(models.categories, { foreignKey: 'month_id', as: 'categories', through: 'month_of_category', onDelete: 'SET NULL' });
    }
  };
  months.init({
    month: DataTypes.STRING,
    year: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'months',
  });
  return months;
};