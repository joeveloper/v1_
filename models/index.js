import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  pool: {
    max: 10,
    min: 0,
    acquire: 1000
  },
  define: {
    timestamps: false
  }
});

const models = {
  AppCountry: sequelize.import('./AppCountry.js'),
  Country: sequelize.import('./Country.js'),
  Feature: sequelize.import('./Feature.js'),
  HeadSchool: sequelize.import('./HeadScool.js'),
  School: sequelize.import('./School.js'),
  User: sequelize.import('./User.js')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
