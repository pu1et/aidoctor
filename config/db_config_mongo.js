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
                    'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
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
        mongo_insert: async (id, col_name, value_arr) => {
            client = MongoClient.connect(
                'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) return [false];

                    db = client.db(config.database);
                    col = db.collection(col_name);

                    var tmp_json = {
                        "id":id, 
                        date_id: value_arr[0], 
                        date:value_arr[1], 
                        water:value_arr[2],
                        sleep:value_arr[3], 
                        food:value_arr[4], 
                        drinking:value_arr[5], 
                        smoking:value_arr[6], 
                        exercise:value_arr[7], 
                        result:value_arr[8]
                    };
                    console.log("insert_json : " + tmp_json);
                    col.insertOne(tmp_json,
                    function (err, result) {
                        if(err) return [false];
                        console.log("json_insert : "+ tmp_json);
                        console.log("[success_insert] MongoDB  -> " + col_name + ", result : ", result);
                        return [true];
                    });
                    client.close();
                });
        },
        mongo_find: async (col_name, query, projection,limit_num=0) => { // id : 사용자 아이디, col_name : 컬렉션 네임, query : 문자열 쿼리, projection : 나올 컬럼
            client = MongoClient.connect(
                'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) return [false];
                    db = client.db(config.database);
                    col = db.collection(col_name);
                    var tmp;

                    if(limit_num == 0) tmp = col.find(query, projection);
                    else tmp = col.find(query, projection).limit(limit_num);
                    tmp.toArray(function(err, doc){
                        if(err) return [false];
                        if(doc != null) console.log(doc);
                        console.log("query_find : "+ JSON.stringify(query));
                        console.log("projection_find : "+ JSON.stringify(projection));
                        console.log("[success_find] MongoDB  -> " + col_name + ", result: "+JSON.stringify(doc));
                        console.log(doc[0]);
                        console.log("==================\n"+doc[1]);
                        return [true, doc];
                    });

                    client.close();
                });
        },
        mongo_update: async (id, col_name, query,operator) => { //operator : 데이터 수정 컬럼과 값
            client = MongoClient.connect(
                'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) return [false];
                    db = client.db(config.database);
                    col = db.collection(col_name);

                    col.update(query, operator, function(err, upserted){
                        if(err) return [false];
                        console.log("query_update : "+ query);
                        console.log("operator_update : "+ query);
                        console.log("[success_update] MongoDB  -> " + col_name + ', result: '+upserted);
                        return [true];
                    })
                    client.close();
                });
        },
        mongo_delete: async (id, col_name, query) => {
            client = MongoClient.connect(
                'mongodb://admin0:admin00!!@aidoctor-docdb.cluster-ckhpnljabh2s.us-west-2.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
                {
                    sslValidate: true,
                    sslCA: ca,
                    useNewUrlParser: true
                },
                function (err, client) {
                    if (err) return [false];
                    db = client.db(config.database);
                    col = db.collection(col_name);

                    col.remove(query, function(err, removed){
                        if(err) return [false];
                        console.log("query_delete : "+ query);
                        console.log("[success_delete] MongoDB  -> " + col_name +", result: "+removed);
                        return [true];
                    })
                    client.close();
                });
        }
    }
};