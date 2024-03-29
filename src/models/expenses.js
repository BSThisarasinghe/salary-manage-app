'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      expenses.belongsTo(models.categories, { foreignKey: 'category_id', as: 'categories', onDelete: 'SET NULL' });
      expenses.belongsTo(models.months, { foreignKey: 'month_id', as: 'months', onDelete: 'SET NULL' });
    }
  };
  expenses.init({
    expense: DataTypes.STRING,
    amount: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    month_id: DataTypes.INTEGER,
    paid: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'expenses',
  });
  return expenses;
};