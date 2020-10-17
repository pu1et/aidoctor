var config = require('../config/db_info_mongo').dev;
var MongoClient = require('mongodb').MongoClient,
f = require('util').format,
fs = require('fs');
var client;

  //Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
module.exports = function () {
    return {
        test_open: function () {
            try {
                client = MongoClient.connect(
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    { sslValidate: true,
                      sslCA:ca,
                      useNewUrlParser: true
                    },
                    function(err, client) {
                        if(err)
                            throw err;
                            
                        //Specify the database to be used
                        db = client.db(config.database);
                        
                        //Specify the collection to be used
                        col = db.collection('test');
                    
                        //Insert a single document
                        /*
                        col.insertOne({'test':'1'}, function(err, result){
                            console.log(result);
                        });
                        */

                        col.findOne({'test':'1'}, function(err, result){
                            console.log(result);
                          });

                       col.deleteOne({'test':'1'},function(err, result){
                        console.log(result);
                        
                    });
                    
                    client.close();
                    console.log("mongodb connection success in port 27017 @@@===");
                });
            } catch (err) {
                console.log("[init] error : ", err);
                throw err;
            }
        }
    }
};