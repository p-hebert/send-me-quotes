"use strict";

const common = require("./common/index");

const User = models.User;

const tests = {};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe("Send-Me-Quotes Testing Suite", function () {
  before(function(done){ clearUserDb(done); });
  if(process.env.TESTS){
    let envtests = process.env.TESTS.split(",");
    for(let key in tests){
      if(envtests.indexOf(key) !== -1){
        importTest(tests[key].name, tests[key].path);
      }
    }
  }else{
    for(let key in tests){
      importTest(tests[key].name, tests[key].path);
    }
  }

  if(process.env.TEST_PHONE){
    importTest("SMS Functionality Testing", './sms/test.js');
  }
  after(function(done){ clearUserDb(done); });
});

function clearUserDb(done){
  var userData = {
    email: {
      $in: ["qtest@abc.com"]
    }
  };

  User.find(userData).remove()
  .then(() => {
    return User.find(userData);
  }).then((result) => {
    assert.ok(result === null);
    done();
  });
}
