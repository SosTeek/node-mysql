/* eslint-disable */
'use strict';
const validator = require('validator')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull:[false, 'This field cannot be empty'],
        unique: true,
        validate: [validator.isEmail, 'Provide a valid email']
      },
      name:{
        type: Sequelize.STRING,
        allowNull:[false, 'This field cannot be empty'],
      },
      password:{
        type: Sequelize.STRING,
        allowNull: [false, 'This field cannot be empty'],
        minlength: 8
      },
      address: {
        type: Sequelize.STRING,
        allowNull: [false, 'This field cannot be empty']
      },
      city: {
        type: Sequelize.STRING,
        allowNull: [false, 'This field cannot be empty']
      },
      phone:{
        type: Sequelize.STRING,
        allowNull: [false, 'This field cannot be empty']
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Customers');
  }
};