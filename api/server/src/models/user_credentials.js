const table = 'user_credentials'
module.exports = (sequelize, DataTypes) => {
  const UserCredentials = sequelize.define(table, {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      default:false,
    },
    createdAt:{
      type: DataTypes.DATE,
      field: 'created'
    },
    updatedAt:{
      type: DataTypes.DATE,
      field: 'updated',
    },
  });
  return UserCredentials;
};