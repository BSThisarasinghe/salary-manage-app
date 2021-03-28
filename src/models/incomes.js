'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class incomes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  incomes.init({
    income: DataTypes.STRING,
    amount: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    month_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'incomes',
  });
  return incomes;
};