/*eslint-disable*/

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        enum: ['admin', 'user'],
        defaultValue: 'user'
      },
      passwordChangedAt: Sequelize.DATE,
      passwordResetToken: Sequelize.STRING,
      passwordResetExpires: Sequelize.DATE,
      // confirmPassword: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};