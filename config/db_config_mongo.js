const { table, assert } = require('console');
const { tmpdir } = require('os');

var config = require('../config/db_info_mongo').dev;
var MongoClient = require('mongodb').MongoClient,
    f = require('util').format,
    fs = require('fs');
var client;

//Specify the Amazon DocumentDB cert
var ca = [fs.readFileSync("rds-combined-ca-bundle.pem")];
module.exports = function () {
    return {
        test_open: async () => {
            try {
                client = MongoClient.connect(
                    'mongodb://' + config.user + ':' + config.password + '@' + config.host + '/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                    {
                        sslValidate: true,
                        sslCA: ca,
                        useNewUrlParser: true
                    },
                    function (err, client) {
                        if (err)
                            throw err;

                        //Specify the database to be used
                        db = client.db(config.database);

                        //Specify the collection to be used
                        col = db.collection('test');

                        //Insert a single document

                        col.insertOne({ 'test': '1' }, function (err, result) {
                            console.log("MongoDB insertOne test : " + result);
                        });


                        col.findOne({ 'test': '1' }, function (err, result) {
                            console.log("MongoDB findOne test : " + result);
                        });

                        col.deleteOne({ 'test': '1' }, function (err, result) {
                            console.log("MongoDB deleteOne test : " + result);

                        });

                        client.close();
                        console.log("mongodb connection success in port 27017 @@@===");
                    });
            } catch (err) {
                console.log("[init] error : ", err);
                throw err;
            }
        },
        mongo_insert: async (id, col_name, column_arr, value_arr) => {
            client = MongoClient.connect(
                'mongodb://' + config.user + ':' + config.password + '@' + config.host + '/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) throw err;
                    var tmp_json = "";

                    db = client.db(config.database);
                    col = db.collection(col_name);

                    tmp_json += "{id : " + id + ",";
                    for (i = 0; i < column_arr.length; i++) {
                        tmp_json += column_arr[i] + ":" + value_arr[i];
                        if (i == (column_arr.length - 1)) tmp_json += "}";
                        else tmp_json += ",";
                    }
                    console.log("insert_json : " + tmp_json);
                    col.insertOne(JSON.parse(tmp_json),
                    function (err, result) {
                        assert.equal(err, null);
                        console.log("json_insert : "+ tmp_json);
                        console.log("[success_insert] MongoDB  -> " + col_name);
                    });
                    client.close();
                });
        },
        mongo_find: async (col_name, projection, query) => { // id : 사용자 아이디, col_name : 컬렉션 네임, query : 문자열 쿼리, projection : 나올 컬럼
            client = MongoClient.connect(
                'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) throw err;
                    var tmp_query = JSON.parse(query);
                    var tmp_proj = JSON.parse(projection);
                    db = client.db(config.database);
                    col = db.collection(col_name);

                    var cursor = col.find(tmp_query, tmp_proj);
                    cursor.each(function(err, doc){
                        if(err) throw err;
                        if(doc != null) console.log(doc);
                        console.log("query_find : "+ query);
                        console.log("projection_find : "+ projection);
                        console.log("[success_find] MongoDB  -> " + col_name);
                    });

                    client.close();
                });
        },
        mongo_update: async (id, col_name, query,operator) => { //operator : 데이터 수정 컬럼과 값
            client = MongoClient.connect(
                'mongodb://' + config.user + ':' + config.password + '@' + config.host + '/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) throw err;
                    db = client.db(config.database);
                    col = db.collection(col_name);

                    col.update(query, operator, function(err, upserted){
                        if(err) throw err;
                        console.log("query_update : "+ query);
                        console.log("operator_update : "+ query);
                        console.log("[success_update] MongoDB  -> " + col_name);
                    })
                    client.close();
                });
        },
        mongo_delete: async (id, col_name, query) => {
            client = MongoClient.connect(
                'mongodb://' + config.user + ':' + config.password + '@' + config.host + '/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) throw err;
                    var tmp_query = JSON.parse(query);
                    db = client.db(config.database);
                    col = db.collection(col_name);

                    col.remove(tmp_query, function(err, removed){
                        if(err) throw err;
                        console.log("query_delete : "+ query);
                        console.log("[success_delete] MongoDB  -> " + col_name);
                    })
                    client.close();
                });
        },
    }
};