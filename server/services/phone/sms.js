const plivo = require('plivo');
const env = process.env.NODE_ENV || 'development';
const config = require('../../../.config/server/index')[env];

module.exports = {
  send: send
};

var p = plivo.RestAPI({
  authId: config.plivo.authId,
  authToken: config.plivo.authToken
});

function send(dest, text){
  return new Promise(function(resolve, reject){
    p.get_numbers({'limit' : '10', 'offset' : '0'}, function(status, response) {
      if (Math.floor(status / 200) === 1 && response.objects.length > 0) {
        let params = {
          src: response.objects[0].number,
          dst: dest,
          text: text
        };
        p.send_message(params, function(status, response) {
          if (Math.floor(status / 200)=== 1) {
            resolve({
              status: status,
              body: response
            });
          } else {
            console.error("> Plivo Verify Failed with Status " + status);
            console.error(response);
            reject({
              status: status,
              body: response
            });
          }
        });
      } else {
        console.error("> Plivo Verify Failed with Status " + status);
        console.error(response);
        reject({
          status: status,
          body: response
        });
      }
    });
  });
}
