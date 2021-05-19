/* eslint-disable */
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Brand.belongsTo(models.Category, {
        foreignKey: 'categoryId', as: 'category'
      })
      Brand.hasMany(models.Product, {
        as: 'products'
      })
    }
  }
  Brand.init(
    {
      brandName: DataTypes.STRING,
      brandImage: DataTypes.STRING,
      brandTagline: DataTypes.STRING,
      categoryId:{
        type:  DataTypes.INTEGER,
        references: {
          model: 'Category',
          key: 'id'
        },
        // onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Brand',
    }
  );
  return Brand;
};
