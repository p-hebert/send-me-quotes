"use strict";

const countries = require('../../static/countries.json');
const moment = require('moment');
var validator = require('validator');

module.exports = validator;

validator.date = {
  isDate: function(text, format){
    return moment(text, format, true).isValid();
  },
  isValidBirthDate: function(text, format){
    var date = moment(text, format, true);
    return date.isValid() && date.isAfter('1940-01-01') && date.isBefore();
  },
  fromDateString: function(text, format){
    return moment(text, format, true).toDate();
  }
};

validator.number = {
  isInteger: function(value){
    if(!Number.isNaN(value)){
      let isStringInt = typeof value === "string" &&
                        value.match(/^\d+$/);
      let isInt = typeof value === "number" &&
                  Number.isInteger(value);
      return isStringInt || isInt;
    }else{
      return false;
    }
  },
  toInteger: function(value){
    let isStringInt = typeof value === "string" &&
                      value.match(/^\d+$/);
    let isInt = typeof value === "number" &&
                Number.isInteger(value);
    if(isStringInt){
      return parseInt(value);
    } else if(isInt){
      return value;
    } else {
      throw new TypeError('Value is not an integer');
    }
  },
  isNumber: function(value){
    if(!Number.isNaN(value)){
      let isStringNumber = typeof value === "string" &&
                        value.match(/^-?\d+(\.\d+)?$/);
      let isNumber = typeof value === "number";
      return isStringNumber || isNumber;
    }else{
      return false;
    }
  },
  toNumber: function(value){
    let isStringNumber = typeof value === "string" &&
                      value.match(/^-?\d+(\.\d+)?$/);
    let isNumber = typeof value === "number";
    if(isStringNumber){
      return parseFloat(value);
    } else if(isNumber){
      return value;
    } else {
      throw new TypeError('Value is not a number');
    }
  }
};

validator.isName = function(text) {
  //For internationalization, use \p{L} instead of [a-zA-Z]
  //Currently no support in core javascript
  const regex = /^([a-zA-Z]+['\s\-]?)+[a-zA-Z]+$/;
  return !!text.trim().match(regex);
};

validator.isCity = function(text) {
  const regex = /^[a-zA-Z]*(?:[\s-][a-zA-Z]*)*$/;
  return text.trim() && !!text.trim().match(regex);
};

validator.isCountry = function(text) {
  const list = Object.keys(countries);
  return list.indexOf(text) !== -1;
};

validator.isValidGender = function(text){
  const genders = ['male', 'female', 'other'];
  return genders.indexOf(text) !== -1;
};

validator.numToString = function(val){
  if (typeof val === "number") {
    val = val.toString();
  }
  return val;
};

validator.isValidZipCode = function(country, text) {
  if(countries[country] === undefined){
    throw new Error('Invalid country');
  }
  if(zip_regexes[countries[country]] === undefined){
    return true;
  }else{
    return !!text.match(zip_regexes[countries[country]]);
  }
};

validator.isAnyPhone = function(str) {
  const locales = [
    'ar-DZ', 'ar-SA', 'ar-SY', 'cs-CZ', 'de-DE', 'da-DK', 'el-GR',
    'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-CA',
    'en-ZA', 'en-ZM', 'es-ES', 'fi-FI', 'fr-FR', 'hu-HU', 'it-IT',
    'ja-JP', 'ms-MY', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'ru-RU',
    'sr-RS', 'tr-TR', 'vi-VN', 'zh-CN', 'zh-TW'
  ];

  for (let i = 0; i < locales.length; i++) {
    if (validator.isMobilePhone(str, locales[i])) {
      return true;
    }
  }
  return false;
};

validator.twitter = {
  isURL: function(text){
    const regex = /^((https|http):\/\/)?twitter\.com\/[A-Za-z0-9_]{1,15}$/;
    return !!text.match(regex);
  },
  isHook: function(text){
    const regex = /^@?[A-Za-z0-9_]{1,15}$/;
    return !!text.match(regex);
  },
  toURL: function(hook){
    return hook.charAt(0) === '@' ?
           `https://twitter.com/${hook.substring(1)}`:
           `https://twitter.com/${hook}`;
  },
  toHook: function(url){
    const urlregex = /((https|http):\/\/)?twitter\.com\//;
    return `@${url.replace(urlregex, '')}`;
  }
};

validator.facebook = {
  isURL: function(text){
    const regex = /^((https|http):\/\/)?facebook\.com\/.*$/;
    return !!text.match(regex);
  }
};

validator.instagram = {
  isURL: function(text){
    const regex = /^((https|http):\/\/)?instagram\.com\/[A-Za-z0-9_]{1,15}$/;
    return !!text.match(regex);
  },
  isHook: function(text){
    const regex = /^@?[A-Za-z0-9_]{1,15}$/;
    return !!text.match(regex);
  },
  toURL: function(hook){
    return hook.charAt(0) === '@' ?
           `https://instagram.com/${hook.substring(1)}`:
           `https://instagram.com/${hook}`;
  },
  toHook: function(url){
    const urlregex = /((https|http):\/\/)?instagram\.com\//;
    return `@${url.replace(urlregex, '')}`;
  }
};
