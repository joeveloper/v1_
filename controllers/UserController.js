/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Environment variables and key configurations
import dotenv from 'dotenv';
// Load models
import models from '../models';

// Load Input validation
import validateRegisterInput from '../validation/register';

// Load generator for subdomain names
import createSubDomainName from '../utils/subDomainCreator';

dotenv.config();

const { User, HeadSchool, School, Feature } = models;

const UserController = {
  /**
   * @route POST api/v1/users/
   * @desc Register a user
   * @access Public
   */
  registerUser(req, res) {
    const split = new Date().toString().split(' ');
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const { errors, isValid } = validateRegisterInput(req.body);

    // Validate input
    if (!isValid) {
      return res.status(400).json(errors);
    }

    School.findOne({ where: { schoolName: req.body.schoolName } })
      .then(existingSchool => {
        if (existingSchool) {
          errors.schoolName = 'School already exists';
          return res.status(400).json(errors);
        }
      })
      .catch(err => {
        return res.status(500).json(err);
      });

    User.findOne({ where: { email: req.body.email } })
      .then(existingUser => {
        if (existingUser) {
          errors.email = 'User already exists';
          return res.status(400).json(errors);
        }
      })
      .catch(err => {
        return res.status(500).json(err);
      });

    HeadSchool.findOne({ where: { schoolName: req.body.schoolName } })
      .then(existingHeadSchool => {
        if (existingHeadSchool) {
          errors.schoolName = 'Head School already exists';
          return res.status(400).json(errors);
        }
        HeadSchool.create({
          schoolName: req.body.schoolName,
          isActive: 1,
          schoolPhone_1: req.body.schoolPhone_1,
          createdDate: Date.now()
        }).then(headSchool => {
          School.create({
            headSchool: headSchool.id,
            schoolName: headSchool.schoolName,
            subDomain: createSubDomainName(headSchool.schoolName),
            isActive: 1,
            createdDate: Date.now(),
            schoolPhone_1: req.body.schoolPhone_1,
            schoolPhone_2: req.body.schoolPhone_2,
            schoolEmail: req.body.schoolEmail,
            emailBalance: 100000,
            smsBalance: 0,
            timeZone: split[5]
          }).then(school => {
            User.create({
              headSchool: headSchool.id,
              school: school.id,
              sex: req.body.sex,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hashedPassword,
              isActive: 1,
              role: 'ROLE_HEAD_SCHOOL_ADMIN',
              createdDate: Date.now(),
              resetPasswordToken: bcrypt.hashSync(headSchool.schoolName, 8),
              canEdit: 1,
              canView: 1,
              canDelete: 1,
              canCreate: 1
            }).then(user => {
              // create a token for registered user
              const token = jwt.sign({ id: user.id }, process.env.SECRET, {
                expiresIn: 86400
              });
              Feature.create({
                headSchool: headSchool.id,
                school: school.id,
                financeManager: 1,
                inventoryManager: 1,
                virtualLearning: 1,
                coBankingByRiby: 1,
                smartSurveillance: 1,
                visitorManagement: 1
              }).then(() => {
                res.status(201).json({
                  success: true,
                  message: 'Account Created',
                  auth: true,
                  token
                });
              });
            });
          });
        });
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  }
};

export default UserController;
