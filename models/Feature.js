export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Feature',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      headSchool: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'HeadSchool',
          key: 'id'
        }
      },
      school: {
        type: DataTypes.INTEGER(11),
        allowNullreferences: {
          model: 'School',
          key: 'id'
        }
      },
      financeManager: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      inventoryManager: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      virtualLearning: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      coBankingByRiby: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      smartSurveillance: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      visitorManagement: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      }
    },
    {
      tableName: 'Feature'
    }
  );
};
