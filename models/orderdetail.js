/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // OrderDetail.belongsTo(models.User, {
      //   foreignKey: 'userId'
      // })
      // OrderDetail.belongsTo(models.Product, {
      //   foreignKey: 'productId'
      // })
    }
  };
  OrderDetail.init({
    productId: DataTypes.INTEGER,
    productQuantity: DataTypes.INTEGER,
    productPrice: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    subTotal: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'OrderDetail',
  });
  return OrderDetail;
};