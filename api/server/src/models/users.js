const table = 'users'
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(table, {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email:{
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dob:{
      type: DataTypes.DATE,
      allowNull: false,
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
  return Users;
};