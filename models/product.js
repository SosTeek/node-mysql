/* eslint-disable */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Brand, {
        foreignKey: 'brandId',
        as: 'brand'
      })
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      })
      Product.belongsToMany(models.Order, {
        through: 'OrderDetails',
        as: 'orders',
        foreignKey: 'productId',
        otherKey: 'orderId'
      })
    }
  };
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING
    },
    photo: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock:{
      type: DataTypes.INTEGER
    },
    categoryId:{
      type: DataTypes.INTEGER
    },
    brandId:{
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};