/* eslint-disable no-param-reassign */
import Validator from 'validator';
import isEmpty from './is-empty';

const validateRegisterInput = data => {
  const errors = {};

  data.schoolName = !isEmpty(data.schoolName) ? data.schoolName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.schoolPhone_1 = !isEmpty(data.schoolPhone_1) ? data.schoolPhone_1 : '';

  if (!Validator.isLength(data.schoolName, { min: 2, max: 60 })) {
    errors.schoolName = 'Name must be between 2 and 60 characters';
  }

  if (Validator.isEmpty(data.schoolName)) {
    errors.schoolName = 'Name field is required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isAlpha(data.password)) {
    errors.password = 'Password must be alphanumeric';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First name is required';
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Last name is required';
  }

  if (Validator.isEmpty(data.schoolPhone_1)) {
    errors.schoolPhone_1 = 'At least one phone number is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateRegisterInput;
