export default (sequelize, DataTypes) => {
  return sequelize.define(
    'HeadSchool',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      schoolName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      isActive: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'HeadSchool'
    }
  );
};
