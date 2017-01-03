const command = require('child_process');
const env = process.env.NODE_ENV || 'development';
const config = require('../.config/mongo/index')[env];

var mongo_eval = `mongo 127.0.0.1:27017/${config.dbname} --eval`;
var promises = [];

for(let i = 0 ; i < config.users.length ; i++){
  let user = config.users[i];
  let create_user = `db.createUser(${JSON.stringify(user)});`;
  promises.push(new Promise(function(resolve, reject) {
    command.exec(`${mongo_eval} '${create_user}'`,  (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject({error: error, stdout: stdout, stderr: stderr});
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      resolve({error: error, stdout: stdout, stderr: stderr});
    });
  }));
}

Promise.all(promises)
.then((results) => { process.exit(0); })
.catch((results) => { process.exit(1); });
