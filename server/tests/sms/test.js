const sms = require("../../services/phone/sms");
const inquirer = require("inquirer");
const crypto = require('crypto');
const chalk = require("chalk");
const assert = require("assert");

var prompt = inquirer.createPromptModule();
var code = crypto.randomBytes(6)
            .toString('hex')
            .slice(0, 6);

it('should send an SMS code to the specified phone number', function() {
  this.timeout(60000);
  var questions = [
    {
      type: 'input',
      name: 'number',
      message: 'Enter the phone number to send the code to: '
    }
  ];
  return prompt(questions)
    .then(function(answer) {
      return [answer.number, `SMQ Test: ${code}`];
    })
    .then((result) => {
      return sms.send(result[0], result[1]);
    })
    .catch((err) => {
      return Promise.reject(new Error(err.body.error));
    });
});

it('sent SMS code should match the received code', function() {
  this.timeout(600000);
  var questions = [
    {
      type: 'input',
      name: 'code',
      message: 'Enter the received code: '
    }
  ];
  return prompt(questions)
    .then(function(answer) {
      console.log(chalk.bold("* Generated Code: ") + code);
      console.log(chalk.bold("* Received Code: ") + answer.code);
      assert.equal(answer.code, code, 'Codes should match');
      return Promise.resolve();
    }).catch(() => {
      return Promise.reject(new Error("Codes are not matching"));
    });
});
