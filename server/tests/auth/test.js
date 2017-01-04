
// UNIT test begin

describe("Integration test for /u/register", function() {

  it("should accept registration", function(done) {

    const userData = {
      email: "qtest10@abc.com",
      username: "qtest10",
      password: "12345",
      confirm: "12345",
      phone: "+15149678646",
      country: "Canada"
    };
    server
      .post("/u/register")
      .send(userData)
      .expect(200)
      .end(function(err, res) {
        if (res.status === 400) {
          let message = res.body.message;
          if (res.body.errors) {
            for (let key in res.body.errors) {
              message += "\n\t" + key + ": " + res.body.errors[key];
            }
          }
          done(new Error(message));
        }else if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it("user should exist", function(done) {

    const userData = {
      email: "qtest10@abc.com",
      username: "qtest10"
    };
    server
      .post("/u/exists")
      .send(userData)
      .expect("Content-type", /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.body.message, 'User already exists');
          assert.equal(res.body.errors.email, true);
          assert.equal(res.body.errors.username, true);
          done();
        }
      });
  });

  it("should refuse already existing credentials", function(done) {

    const userData = {
      username: "iexist",
      email: "qtest10@abc.com",
      password: "12345",
      confirm: "12345",
      phone: "+15149678646",
      country: "Canada"
    };
    server
      .post("/u/register")
      .send(userData)
      .expect("Content-type", /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          assert.equal(res.body.message, 'User already exists');
          assert.equal(res.body.errors.email, true);
          assert.equal(res.body.errors.username, false);
          done();
        }
      });
  });

});

describe("Integration test for /u/login", function() {

  it("should return logged in user", function(done) {

    const userData = {
      email: "qtest10@abc.com",
      password: "12345"
    };
    const expectedUserData = {
      username: "qtest10",
      email: "qtest10@abc.com",
      country: "Canada",
      sets: [],
      notes: []
    };
    server
      .post("/u/login")
      .send(userData)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          if (res.body.user) {
            assert.equal(res.body.user.username, expectedUserData.username);
            assert.equal(res.body.user.email, expectedUserData.email);
            assert.equal(res.body.user.country, expectedUserData.country);
            assert.equal(res.body.user.sets.length, 0);
            assert.equal(res.body.user.notes.length, 0);
            assert.equal(Object.keys(res.body.user).length, 5, "User properties should be filtered");
          } else {
            assert.fail(true, true, 'res.body.user is undefined');
          }
          done();
        }
      });
  });

  it("should logout successfully", function(done) {
    server
      .get("/u/logout")
      .expect(200)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it("should not be able to logout twice in a row", function(done) {
    server
      .get("/u/logout")
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it("should return HTTP 401: Unauthorized for an inexistent email", function(done) {

    // calling home page api
    const userData = {
      email: "qtest123@abc.com",
      password: "12345"
    };
    server
      .post("/u/login")
      .send(userData)
      .expect(401) // THis is HTTP response
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

  it("should return HTTP 401: Unauthorized for bad credentials", function(done) {

    // calling home page api
    const userData = {
      email: "qtest10@abc.com",
      password: "123456"
    };
    server
      .post("/u/login")
      .send(userData)
      .expect(401) // THis is HTTP response
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });

});
