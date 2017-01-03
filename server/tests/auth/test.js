
// UNIT test begin

describe("Integration test for /u/register", function() {

  it("should accept registration", function(done) {

    var userData = {
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

    var userData = {
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

    var userData = {
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
