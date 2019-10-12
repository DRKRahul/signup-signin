'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_credentials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tokenExpiry: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isActive:{
        type: Sequelize.BOOLEAN,
        default:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_credentials');
  }
};