/* eslint-disable no-param-reassign */
import Validator from 'validator';
import isEmpty from './is-empty';

const validateEditUserInput = data => {
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
  data.newPassword2 = !isEmpty(data.newPassword2) ? data.newPassword2 : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isAlpha(data.newPassword)) {
    errors.newPassword = 'Password must be alphanumeric';
  }

  if (!Validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.newPassword2)) {
    errors.newPassword2 = 'Confirm password field is required';
  }

  if (!Validator.equals(data.newPassword, data.newPassword2)) {
    errors.newPassword2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateEditUserInput;
