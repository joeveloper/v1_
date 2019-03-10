export default (sequelize, DataTypes) =>
  sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
      school: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        references: {
          model: 'School',
          key: 'id'
        }
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sex: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      isActive: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      role: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      canEdit: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      canDelete: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      canView: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      canCreate: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      lastSeen: {
        type: DataTypes.DATE,
        allowNull: true
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      tableName: 'User'
    }
  );
