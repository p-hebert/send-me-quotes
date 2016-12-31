
module.exports = {
  login: login,
  logout: logout,
  register: register,
  unregister: unregister
};

/**
 * Register functionality
 * @param done : done callback for the mocha tests
 * @param data : User data of the user to login. If undefined,
 *               default data is used.
 * @param next : Next callback to execute once user is logged in.
 *               If undefined, will simply call done callback.
 * @param promise : Boolean whether or not the call should return a
 *                  promise rather than call next
**/
function register(options){
  var done = options.done;
  var data = options.data;
  var next = options.next;
  var promise = options.promise;
  var p;

  const registerData = {
    email: "qtest@abc.com",
    password: "12345"
  };

  if(typeof done !== "function" && !promise){
    throw new Error("done param is mandatory; should be a function");
  }
  if(!data){
    data = registerData;
  }

  p = new Promise(function(resolve, reject){
    server
      .post("/register")
      .send(data)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          if(promise){
            reject(err);
          }else{
            done(err);
          }
        } else {
          if(promise){
            resolve(res);
          }else{
            if(typeof next === "function"){
              next(done, res);
            }else{
              done();
            }
          }
        }
      });
  });
  if(promise){
    return p;
  }
}

/**
 * Unregister functionality
 * @param done : done callback for the mocha tests
 * @param data : User data of the user to login. If undefined,
 *               default data is used.
 * @param next : Next callback to execute once user is logged in.
 *               If undefined, will simply call done callback.
 * @param promise : Boolean whether or not the call should return a
 *                  promise rather than call next
**/
function unregister(options){
  var done = options.done;
  var data = options.data;
  var next = options.next;
  var promise = options.promise;
  var p;

  const User = models.User;
  const userData = {
    email: "qtest@abc.com"
  };

  if(typeof done !== "function" && !promise){
    throw new Error("done param is mandatory; should be a function");
  }
  if(!data){
    data = userData;
  }

  p = User.findOneAndRemove(data)
  .then(function() {
    return User.findOne(data)
    .then(function(result) {
      if(promise){
        return Promise.resolve(result);
      }else{
        if(typeof next === "function"){
          next(done, result);
        }else{
          done();
        }
      }
    });
  }).catch(function(err) {
    if(promise){
      return Promise.reject(err);
    }else{
      done(err);
    }
  });

  if(promise){
    return p;
  }
}

/**
 * Login functionality
 * @param done : done callback for the mocha tests
 * @param data : User data of the user to login. If undefined,
 *               default data is used.
 * @param next : Next callback to execute once user is logged in.
 *               If undefined, will simply call done callback.
 * @param promise : Boolean whether or not the call should return a
 *                  promise rather than call next
**/
function login(options){
  var done = options.done;
  var data = options.data;
  var next = options.next;
  var promise = options.promise;
  var p;

  const loginData = {
    email: "freshcut_test10@abc.com",
    password: "12345"
  };

  if(typeof done !== "function" && !promise){
    throw new Error("done param is mandatory; should be a function");
  }
  if(!data){
    data = loginData;
  }

  p = new Promise(function(resolve, reject){
    server
      .post("/login")
      .send(data)
      .expect("Content-type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) {
          if(promise){
            reject(err);
          }else{
            done(err);
          }
        } else {
          if(promise){
            resolve(res);
          }else{
            if(typeof next === "function"){
              next(done, res);
            }else{
              done();
            }
          }
        }
      });
  });

  if(promise){
    return p;
  }
}

/**
 * Logout functionality
 * @param done : done callback for the mocha tests
 * @param data : User data of the user to login. If undefined,
 *               default data is used.
 * @param next : Next callback to execute once user is logged in.
 *               If undefined, will simply call done callback.
 * @param promise : Boolean whether or not the call should return a
 *                  promise rather than call next
**/
function logout(options){
  var done = options.done;
  var data = options.data;
  var next = options.next;
  var promise = options.promise;
  var p;

  if(typeof done !== "function" && !promise){
    throw new Error("done param is mandatory; should be a function");
  }

  p = new Promise(function(resolve, reject){
    server
      .get("/logout")
      .expect(200)
      .end(function(err, res) {
        if (err) {
          if(promise){
            reject(err);
          }else{
            done(err);
          }
        } else {
          if(promise){
            resolve(res);
          }else{
            if(typeof next === "function"){
              next(done, res);
            }else{
              done();
            }
          }
        }
      });
  });

  if(promise){
    return p;
  }
}
