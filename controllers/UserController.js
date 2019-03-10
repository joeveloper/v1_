/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Environment variables and key configurations
import dotenv from 'dotenv';
// Load models
import models from '../models';

// Load Input validation
import validateRegisterInput from '../validation/register';
import validateLoginInput from '../validation/login';
import validateEditUserInput from '../validation/editUser';

// Load generator for subdomain names
import createSubDomainName from '../utils/subDomainCreator';

dotenv.config();

const { User, HeadSchool, School, Feature } = models;

const UserController = {
  /**
   * @route POST api/v1/users/
   * @description Register a user
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns status code & message
   * @access public
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
  },

  /**
   * @route POST api/v1/users/login
   * @description Login existing user/Return JWToken
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns {Object} - status code and user payload
   * @access public
   */
  loginUser(req, res) {
    // Validate input fields
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Find user by email
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Check password
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            email: user.email
          };

          // Sign Token
          jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          });

          User.update({ lastSeen: Date.now() }, { where: { id: user.id } });
        } else {
          errors.password = 'Password Incorrect';
          res.status(400).json(errors);
        }
      });
    });
  },

  /**
   * @route GET api/v1/users/:id
   * @description Get a user by ID
   * @param {Number} id - user id
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns {Object} - status code and user details
   * @access private
   */
  getUserById(req, res) {
    const { id } = req.params;
    User.findOne({ where: { id } }).then(user => {
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User does not exist'
        });
      }
      return res.status(200).json({
        sucess: true,
        data: user
      });
    });
    return User.update({ lastSeen: Date.now() }, { where: { id: req.user.id } });
  },

  /**
   * @route GET api/v1/users/current
   * @description - Get current signed in user profile
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns {Object} - current user information
   * @access private
   */
  getCurrentuser(req, res) {
    return res.json({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      school: req.user.school
    });
  },

  /**
   * @route PUT api/v1/users/
   * @description - User edit signed in profile
   * @param {Object} req - request
   * @param {Object} res - response
   * @returns {Object} - Edited user information
   * @access private
   */
  editUser(req, res) {
    // Validate input fields
    const { errors, isValid } = validateEditUserInput(req.body);
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    bcrypt.compare(req.body.oldPassword, req.user.password).then(isMatch => {
      if (isMatch) {
        User.update(
          {
            sex: req.body.sex,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
          },
          { where: { id: req.user.id } }
        ).then(() => {
          return res.json({
            success: true,
            message: 'Profile updated successfully'
          });
        });
      } else {
        errors.password = 'Password Incorrect';
        res.status(400).json(errors);
      }
    });
    return User.update({ lastSeen: Date.now() }, { where: { id: req.user.id } });
  }
};

export default UserController;
