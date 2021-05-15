/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsToMany(models.Product, {
        through: 'OrderDetails',
        as: 'products',
        foreignKey: 'orderId',
        otherKey: 'productId'

      })
    }
  };
  Order.init({
    orderNo: DataTypes.INTEGER,
    orderDate: DataTypes.DATE,
    orderTotal: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    shippingDate: DataTypes.DATE,
    isDelivered: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};