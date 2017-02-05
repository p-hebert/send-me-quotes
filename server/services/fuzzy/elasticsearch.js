const env = process.env.NODE_ENV || 'development';
const config = require('../../../.config/server/index')[env];
config.es = config.elasticsearch;
const elasticsearch = require('elasticsearch');
const ErrorBuilder = require('../../utilities/errors/ErrorBuilder');

var elasticclient = elasticclient = new elasticsearch.Client({
  host: `${config.es.protocol}://${config.es.host}:${config.es.port}`,
  log: config.elasticsearch.log
});

module.exports = {
  init: init,
  client: elasticclient
};

function init(){
  logger.log(`Initiating connection to elasticsearch @ ${config.es.host}:${config.es.port}`);
  return new Promise(function(resolve, reject){
    elasticclient.ping({
      // ping usually has a 3000ms timeout
      requestTimeout: 3000
    }, function (error) {
      if (error) {
        logger.crit(error);
        reject(ErrorBuilder.construct({type: "SETUP:ELASTICSEARCH:UNAVAILABLE", metadata: error}));
      } else {
        resolve();
      }
    });
  });
}
