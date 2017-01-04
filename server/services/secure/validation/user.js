"use strict";

const secure = require('../hash');
const validator = require('./validator');

module.exports = validate_user;

function validate_user(update, user) {
  var validated = {};
  var refused = false;
  var errors = {};
  if (typeof update === "object" && update !== null && Object.keys(update).length) {
    for (var key in update) {
      if (update.hasOwnProperty(key)) {
        switch (key) {
        case 'email':
          if (update[key] !== null && validator.isEmail(update[key])) {
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Invalid email";
          }
          break;
        case 'username':
          if (update[key] !== null && validator.isUsername(update[key])) {
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Invalid username";
          }
          break;
        case 'country':
          if(update[key] && validator.isCountry(update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Invalid country";
          }
          break;
        case 'phone':
          try {
            update[key] = validator.numToString(update[key]);
            if (!Number.isNaN(update[key]) && validator.isAnyPhone(update[key])) {
              validated[key] = update[key];
              validated.phoneVerified = false;
              validated.phoneCode = '';
            } else {
              refused = true;
              errors[key] = "Invalid phone number";
            }
          } catch (err) {
            refused = true;
            errors[key] = "Invalid format for phone number";
          }
          break;
        case 'password':
          validate_password(update, user, validated, refused, errors);
          break;
        default:
          break;
        }
      }
    }
  } else {
    errors = undefined;
    refused = true;
  }
  return {
    validated: validated,
    refused: refused,
    errors: errors
  };
}

function validate_password(update, user, validated, refused, errors){
  update.password = update.password + "";
  update.confirm = update.confirm + "";

  //Registering
  if(!user){
    //password
    //Validates format of new password
    if (validator.isAscii(update.password)) {
      let pwd = secure.hash(update.password);
      validated.password = pwd.hash;
      validated.salt = pwd.salt;
    } else {
      refused = true;
      errors.password = "Invalid characters used in password. Use ASCII characters";
    }
    //confirm password
    if (errors.password || !(typeof update.confirm === 'string') || !validator.isAscii(update.confirm) ||
    !update.hasOwnProperty('password') || !validator.equals(update.confirm, update.password)) {
      refused = true;
      errors.confirm = "Passwords do not match";
    }
  //Updating
  }else{
    //requires 'password', 'confirm', and 'oldPassword' fields to be passed
    //for validation to proceed.
    update.oldPassword = update.oldPassword + "";
    update.password = update.password + "";
    update.confirm = update.confirm + "";

    //Catches invalid formats for old password
    if(update.oldPassword !== null && typeof update.oldPassword !== "string" || !validator.isAscii(update.oldPassword)){
      refused = true;
      errors.oldPassword = "Current password is needed to change password";
    //Matches old password against db
    } else if (update.password !== null && secure.validate_pwd_hash(update.oldPassword, user.salt, user.password)) {
      //password
      //Validates format of new password
      if (validator.isAscii(update.password)) {
        let pwd = secure.hash(update.password);
        validated.password = pwd.hash;
        validated.salt = pwd.salt;
      } else {
        refused = true;
        errors.password = "Invalid characters used in password. Use ASCII characters";
      }
      //confirm password
      if (errors.password || !(typeof update.confirm === 'string') || !validator.isAscii(update.confirm) ||
      !update.hasOwnProperty('password') || !validator.equals(update.confirm, update.password)) {
        refused = true;
        errors.confirm = "Passwords do not match";
      }
    } else {
      refused = true;
      errors.oldPassword = "Invalid password";
    }
  }
}
