"use strict";

const fs = require('fs');
const path = require('path');
const winston = require("winston");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../.config/server/index')[env];
const syslog_error_levels = Object.keys(winston.config.syslog.levels);

var instance;

class Logger {
  constructor(conf){
    if(instance instanceof Logger){
      instance.logger.log('info', "Logger already instantiated");
      return instance;
    }else{
      this.logger = winston;
      this.callbacks = winston.config.syslog.levels;
      for (let level in this.callbacks) {
        this.callbacks[level] = {"before": [], "after": [], "around": null};
      }
      this.logger.setLevels(winston.config.syslog.levels);
      let log_config = conf || config.logger;
      Object.keys(log_config.levels).forEach((l) => {
        //If valid log level
        if(syslog_error_levels.indexOf(l) !== -1){
          //Convert config in winston configuration
          log_config.levels[l].forEach((src) => {
            if(src.type === "file"){
              touchSync(src.filename);
              src.options.level = l;
              this.logger.add(winston.transports.File, src.options);
            }else if(src.type === "console"){
              if(src.options && src.options.name){
                this.logger.add(winston.transports.Console, src.options);
              }
            }
          });
        }else{
          throw new Error("Invalid logging levels");
        }
      });
      instance = this;
      this.logger.log('info', "Logger instantiated");
    }

  }

  getInstance(config){
    return instance || new Logger(config);
  }

  before(){
    let args = Array.from(arguments);
    args.unshift('before');
    return this.use.apply(this, args);
  }

  around(){
    let args = Array.from(arguments);
    args.unshift('around');
    return this.use.apply(this, args);
  }

  after(){
    let args = Array.from(arguments);
    args.unshift('after');
    return this.use.apply(this, args);
  }

  use(){
    let when = "before";
    let level;
    let cb;
    if(arguments.length === 2){
      level = arguments[0];
      cb = arguments[1];
    }else if(arguments.length === 3){
      when = arguments[0];
      level = arguments[1];
      cb = arguments[2];
    }else{
      throw new Error("Invalid number of arguments");
    }

    if(typeof level !== "string" || syslog_error_levels.indexOf(level) === -1){
      throw new Error("level should be a defined syslog logging level");
    }
    if(typeof when !== "string" || ["before", "after", "around"].indexOf(when) === -1){
      throw new Error("when should be before, after or around");
    }
    if(typeof cb !== "function"){
      throw new TypeError("Callback should be a function");
    }
    if(when === "around"){
      this.callbacks[level][when] = cb;
    }else{
      this.callbacks[level][when].push(cb);
    }
  }

  print(){
    let self = this;
    let result;
    let args = Array.from(arguments);
    let before = this.callbacks[args[0]]["before"];
    let around = this.callbacks[args[0]]["around"];
    let after = this.callbacks[args[0]]["after"];
    //console.log(this.logger);
    if(typeof args[0] !== "string" || syslog_error_levels.indexOf(args[0]) === -1){
      return null;
    }else{
      before.forEach((cb) => { result = cb(args); });
      if(around){
        result = around(args, () => { return self.logger.log.apply(self.logger, args); });
      }else{
        this.logger.log.apply(this.logger, args);
      }
      after.forEach((cb) => { result = cb(args); });
      return result;
    }
  }

  debug(){
    let args = Array.from(arguments);
    args.unshift('debug');
    return this.print.apply(this, args);
  }

  log(){
    let args = Array.from(arguments);
    args.unshift('info');
    return this.print.apply(this, args);
  }

  notice(){
    let args = Array.from(arguments);
    args.unshift('notice');
    return this.print.apply(this, args);
  }

  warn(){
    let args = Array.from(arguments);
    args.unshift('warn');
    return this.print.apply(this, args);
  }

  error(){
    let args = Array.from(arguments);
    args.unshift('error');
    return this.print.apply(this, args);
  }

  crit(){
    let args = Array.from(arguments);
    args.unshift('crit');
    return this.print.apply(this, args);
  }

  alert(){
    let args = Array.from(arguments);
    args.unshift('crit');
    return this.print.apply(this, args);
  }

  emerg(){
    let args = Array.from(arguments);
    args.unshift('crit');
    return this.print.apply(this, args);
  }

}

function touchSync(file){
  try {
    fs.mkdirSync(path.dirname(file));
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
  try {
    fs.open(file, 'w', (err) => {
      if(err){
        throw err;
      }
    });
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

module.exports = Logger;
