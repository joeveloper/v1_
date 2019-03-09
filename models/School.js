export default (sequelize, DataTypes) => {
  return sequelize.define(
    'School',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      appCountry: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'AppCountry',
          key: 'id'
        }
      },
      headSchool: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'HeadSchool',
          key: 'id'
        }
      },
      schoolName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      subDomain: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
      },
      isActive: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      schoolEmail: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      schoolPhone_1: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      schoolPhone_2: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      emailBalance: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      smsBalance: {
        type: DataTypes.INTEGER(11),
        allowNull: false
      },
      timeZone: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      tableName: 'School'
    }
  );
};
