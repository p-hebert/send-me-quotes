'use strict';

const secure = require('./hash');
const validator = require('../utilities/validator');

module.exports = {
  user: validate_user,
  barber: validate_barber,
  comment: validate_comment
};

function validate_barber(update, barber){
  var validated = {};
  var refused = false;
  var errors = {Barber: {}};
  if (typeof update === "object" && update !== null && Object.keys(update).length) {
    for (var key in update) {
      if (update.hasOwnProperty(key)) {
        switch (key) {
        case 'id':
          break;
        case 'email':
          if (update[key] && validator.isEmail(update[key])) {
            validated[key] = update[key];
          } else {
            refused = true;
            errors.Barber[key] = "Invalid barber email";
          }
          break;
        case 'city':
          if(update[key] && validator.isCity(update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors.Barber[key] = "Invalid city format. Only letters, dash, and spaces are allowed";
          }
          break;
        case 'country':
          if(update[key] && validator.isCountry(update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors.Barber[key] = "Invalid country";
          }
          break;
        case 'dateOfBirth':
        case 'dob':
          if(update[key] && validator.date.isValidBirthDate(update[key], "YYYY-MM-DD")){
            validated[key] = validator.date.fromDateString(update[key], "YYYY-MM-DD");
          } else {
            refused = true;
            errors.Barber[key] = "Invalid date format";
          }
          break;
        case 'zipCode':
          let country = '';
          if(update[key] && update['country'] !== undefined){
            country = update['country'];
          }else if (update[key] && barber !== undefined) {
            country = barber.country;
          }
          if(update[key] && country && validator.isValidZipCode(country, update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors.Barber[key] = !country ?
                          "No country provided, can't validate zip code" :
                          "Invalid zip code";
          }
          break;
        case 'website':
          if(!update[key]){
            validated[key] = "";
          } else if(validator.isURL(update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors.Barber[key] = "Invalid website URL";
          }
          break;
        case 'twitter':
          if(!update[key]){
            validated[key] = "";
          }else{
            let isTwitterURL = validator.twitter.isURL(update[key]);
            let isTwitterHook = validator.twitter.isHook(update[key]);
            if(isTwitterHook){
              validated[key] = validator.twitter.toURL(update[key]);
            } else if(isTwitterURL){
              validated[key] = update[key];
            } else {
              refused = true;
              errors.Barber[key] = "Invalid twitter URL";
            }
          }
          break;
        case 'instagram':
          if(!update[key]){
            validated[key] = "";
          }else{
            let isInstagramURL = validator.instagram.isURL(update[key]);
            let isInstagramHook = validator.instagram.isHook(update[key]);
            if(isInstagramHook){
              validated[key] = validator.instagram.toURL(update[key]);
            } else if(isInstagramURL){
              validated[key] = update[key];
            } else {
              refused = true;
              errors.Barber[key] = "Invalid instagram URL";
            }
          }
          break;
        case 'facebook':
          if(!update[key]){
            validated[key] = "";
          }else{
            if(validator.facebook.isURL(update[key])){
              validated[key] = update[key];
            } else {
              refused = true;
              errors.Barber[key] = "Invalid Facebook URL";
            }
          }
          break;
        case 'rating':
        case 'longitude':
        case 'lattitude':
        case 'utcOffset':
          const ranges = {
            'rating': [0,5],
            'longitude':[-180,180],
            'lattitude':[-90,90],
            'utcOffset': [-12, 14]
          };
          if(validator.number.isNumber(update[key])){
            let value = validator.number.toNumber(update[key]);
            if(value >= ranges[key][0] && value <= ranges[key][1]){
              validated[key] = value;
            }else{
              refused = true;
              errors.Barber[key] = "Invalid "+key+" value";
            }
          }else{
            refused = true;
            errors.Barber[key] = "Invalid "+key+" value";
          }
          break;
        case 'address':
          validated[key] = update[key];
          break;
        case 'services':
          if(!update[key] || !Array.isArray(update[key])){
            refused = true;
            errors.Barber[key] = "Invalid list of services";
          }else{
            validated[key] = [];
            for(let i = 0; i < update[key].length ; i++){
              if(validator.number.isInteger(update[key][i])){
                validated[key][i] = validator.number.toInteger(update[key][i]);
              }else{
                refused = true;
                errors.Barber[key] = "Invalid type at services[" + i + "]. Must be an integer";
                break;
              }
            }
          }
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

function validate_user(update, user) {
  var validated = {};
  var refused = false;
  var errors = {};
  if (typeof update === "object" && update !== null && Object.keys(update).length) {
    for (var key in update) {
      if (update.hasOwnProperty(key)) {
        switch (key) {
        case 'id':
          break;
        case 'email':
          if (update[key] !== null && validator.isEmail(update[key])) {
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Invalid email";
          }
          break;
        case 'firstName':
        case 'lastName':
          if (update[key] !== null && validator.isName(update[key])) {
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Invalid format for name";
          }
          break;
        case 'gender':
          if(update[key] !== null && validator.isValidGender(update[key])){
            validated[key] = update[key];
          } else {
            refused = true;
            errors[key] = "Gender is not listed in the accepted list of gender. Please take 'other' if your gender is not listed";
          }
          break;
        case 'phoneNumber':
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
          //requires 'password', 'confirm', and 'oldPassword' fields to be passed
          //for validation to proceed.

          //check for old password
          //type cast to string (cause you know some people like bad passwords)
          update.oldPassword = validator.numToString(update.oldPassword);
          update.password = validator.numToString(update.password);
          update.confirm = validator.numToString(update.confirm);

          //Catches invalid formats for old password
          if(update.oldPassword !== null && typeof update.oldPassword !== "string" || !validator.isAscii(update.oldPassword)){
            refused = true;
            errors.oldPassword = "Current password is needed to change password";
          //Matches old password against db
          } else if (update.password !== null && secure.validate_pwd_hash(update.oldPassword, user.salt, user.password)) {
            //password
            //Validates format of new password
            if (validator.isAscii(update.password)) {
              let pwdHash = secure.generatePwdHash(update.password);
              validated.password = pwdHash.passwordHash;
              validated.salt = pwdHash.salt;
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

function validate_comment(comment){
  var validated = {};
  var refused = false;
  var errors = {};
  var isobject = typeof comment === "object" && comment !== null && Object.keys(comment).length;

  if (isobject && comment.requestID !== undefined) {
    for(let key in comment){
      switch(key){
      case 'requestID':
        if(validator.number.isInteger(comment[key])){
          let value = validator.number.toInteger(comment[key]);
          if(value < 1){
            refused = true;
            errors[key] = 'Invalid requestID: should be an integer';
          }else{
            validated[key] = validator.number.toInteger(comment[key]);
          }
        }else{
          refused = true;
          errors[key] = 'Invalid requestID: should be an integer';
        }
        break;
      case 'type':
        const timelapses = {
          '15': '15 minutes',
          '30': '30 minutes',
          '45': '45 minutes',
        };

        if(comment[key] === 'modification' || comment[key] === 'cancel'){
          validated[key] = comment[key];
          if(comment['text'].length <= 255 && comment['text'].trim().length > 5){
            validated['text'] = comment['text'];
          }else{
            errors['text'] = 'Comment should be longer than 5 characters and shorter than 256 characters';
          }
        }else if(comment[key] === 'late'){
          validated[key] = comment[key];
          if(!Object.keys(timelapses).indexOf(comment['lateBy'].toString()) !== -1){
            validated['text'] = timelapses[comment['lateBy'].toString()];
          }else{
            errors['lateBy'] = 'Can only be late by pretermined amounts (15m, 30m, 45m).';
          }
        }else{
          errors[key] = 'Invalid request comment type';
        }
        break;
      default:
        break;
      }
    }
  }else if (isobject && comment.reviewID !== undefined) {
    //Include ReviewComment validation here when necessary
    errors = undefined;
    refused = true;
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
