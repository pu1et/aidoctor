var mysql = require('mysql2/promise');
var config = require('../config/db_info_mysql').dev;
var pool;

module.exports = function () {
    return {
        init: function () {
            try {
                pool = mysql.createPool({
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password,
                    database: config.database,
                    connectionLimit: 4
                });
            } catch (err) {
                console.log("[init] error : ", err);
                throw err;
            }
        },
        test_open: async () => {
            try {
                var con = await pool.getConnection(async conn => conn);

                var sql = 'INSERT INTO test(test_id) values (1)';
                var de_sql = 'delete from test where test_id = 1';
                con.query(de_sql, function (err, rows, fields) {
                    if (err) {
                        console.log('Save Rejected : ', err);
                    } else {
                        console.log('Save Resolved : ', rows.insertId);
                    }
                })
                con.query(sql, function (err, rows, fields) {
                    if (err) {
                        console.log('Save Rejected : ', err);
                    } else {
                        console.log('Save Resolved : ', rows);
                    }
                })             
                console.log("mysql database connection success in port 3306 @@@===");
            
            } catch (err) {
                console.error('mysql connection error : ', err);
                throw err;
            } finally {
                con.release();
            }
            /* sort id_num in user table
            con.query('alter table user auto_increment = 1');
            con.query('set @count = 0');
            con.query('update user set id_num = @count:=@count+1'); 
            */
        },
        insert_join: async (table, params) => {
            var con = await pool.getConnection(async conn => conn);

            var sql = 'INSERT INTO ';
            if (table == "user") {
                sql += 'user (id, pw, name, gender, area, age, phone, checked) VALUES (?,?,?,?,?,?,?,?)';
            } else if (table == "logincount") {
                sql += 'logincount (id_num, failcount, last_login) VALUES (?,?,?)';
            } else if (table == "disease_all") {
                if (params.length != 12) sql += 'disease_all (id_num) VALUES (?)';
                else {
                    tmp = '?';
                    for(i=0;i<11;i++) tmp += ',?';
                    sql += 'disease_all (id_num, diabetes, hepatitisA, hepatitisB, hepatitisC, cirrhosis, gastriculcer, lungcancer, lungdisease, myocardial, stroke, depression) VALUES (' + tmp + ')';
                }
            } else if (table == "disease_prefer") {
                sql += 'disease_prefer (id_num) VALUES (?)';
            } else if (table == "diseaseag") {
                if (params.length != 40) sql += 'diseaseag (id_num, age, gender) VALUES (?,?,?)';
                else {
                    tmp = '?';
                    for(i=0;i<39;i++) tmp += ',?';
                    sql += 'diseaseag (id_num, carstairs,HE_DMfh,HE_IHDfh,DE1_dg,DI1_dg,DI3_dg,bmi,age,gender,is_obesity,BD2_1,BS3_2,BS3_1,exercise,area,FPG,TG,leukocyte,total_colesterol,'
                    sql += 'HDL,LDL,HbA,SBP,DBP,is_atrialFibrillation,PT_INR,bilirubin,creatinine,ammonia,AFP,albumin,platelet,DLD_serve,is_hypercholesterolemia,is_chemicHeartDisease,history_cancer,meal_reg,salt_pref,dr_5y) VALUES (' + tmp + ')';
                }
            } else if (table == "diseaseml") {
                if (params.length != 45) sql += 'diseaseml (id_num, age, gender) VALUES (?,?,?)';
                else {
                    tmp = '?';
                    for(i=0;i<44;i++) tmp += ',?'
                    sql += 'diseaseml (id_num,age,gender,HE_fh,HE_HPfh,HE_HLfh,HE_IHDfh,HE_STRfh,HE_HBfh,HE_DMfh,BH2_61,DI1_dg,DI2_dg,DI3_dg,DJ4_dg,DI4_dg,DJ2_dg,DE1_dg,DE1_32,DC1_dg,'
                    sql += 'DC2_dg,DC6_dg,DJ8_dg,DJ6_dg,DK8_dg,DK9_dg,DK4_dg,exercise,BO1_1,BP1,D_1_1,BE5_1,BS3_1,DI1_2,DI2_2,HE_ht,HE_wt,EC_wht_23,HE_sput2,BS3_2,Total_slp_wk,Total_slp_wd,BD2_1,BE3_33,bmi) VALUES (' + tmp + ')';
                }
            } else if (table == "disease_data") {
                    tmp = '?';
                    for(i=0;i<71;i++) tmp += ',?'
                    sql += 'diseaseml (id_num,age,gender,area,HE_fh,HE_HPfh,HE_HLfh,HE_IHDfh,HE_STRfh,HE_HBfh,HE_DMfh,BH2_61,DI1_dg,DI2_dg,DI3_dg,DJ4_dg,DI4_dg,DJ2_dg,DE1_dg,DE1_32,DC1_dg,'
                    sql += 'DC2_dg,DC6_dg,DJ8_dg,DJ6_dg,DK8_dg,DK9_dg,DK4_dg,exercise,BO1_1,BP1,D_1_1,BE5_1,BS3_1,DI1_2,DI2_2,HE_ht,HE_wt,EC_wht_23,HE_sput2,BS3_2,Total_slp_wk,Total_slp_wd,BD2_1,BE3_33,bmi,'
                    sql += 'depSum, is_obesity, carstairs, FPG,TG,leukocyte,total_colesterol, HDL,LDL,HbA,SBP,DBP,is_atrialFibrillation,PT_INR,bilirubin,creatinine,ammonia,AFP,albumin,platelet,DLD_serve,'
                    sql += 'is_hypercholesterolemia,is_chemicHeartDisease,history_cancer,meal_reg,salt_pref,dr_5y) VALUES (' + tmp + ')';
            } else if (table == "day_diabetes") {
                sql += 'day_diabetes (id_num, day) VALUES (?,?)';
            } else if (table == "day_hepatitisa") {
                sql += 'day_hepatitisa (id_num, day) VALUES (?,?)';
            } else if (table == "day_hepatitisb") {
                sql += 'day_hepatitisb (id_num, day) VALUES (?,?)';
            } else if (table == "day_hepatitisc") {
                sql += 'day_hepatitisc (id_num, day) VALUES (?,?)';
            } else if (table == "day_cirrhosis") {
                sql += 'day_cirrhosis (id_num, day) VALUES (?,?)';
            } else if (table == "day_gastriculcer") {
                sql += 'day_gastriculcer (id_num, day) VALUES (?,?)';
            } else if (table == "day_lungcancer") {
                sql += 'day_lungcancer (id_num, day) VALUES (?,?)';
            } else if (table == "day_lungdisease") {
                sql += 'day_lungdisease (id_num, day) VALUES (?,?)';
            } else if (table == "day_myocardial") {
                sql += 'day_myocardial (id_num, day) VALUES (?,?)';
            } else if (table == "day_stroke") {
                sql += 'day_stroke (id_num, day) VALUES (?,?)';
            } else if (table == "day_depression") {
                sql += 'day_depression (id_num, day) VALUES (?,?)';
            }
            try {
                var lock_sql = 'LOCK TABLES '+table+' WRITE';
                con.query(lock_sql);
                console.log("LOCK ",table);
                var ret = await con.query(sql, params);
                console.log('[insert_join->', table, '] Save Resolved : ', ret[0]);
                return [true,ret[0].insertId];
            }catch(err){
                console.log('[insert_join->', table, '] Save Rejected : ', err);
                return [false];
            } finally {
                con.release();
                con.query('UNLOCK TABLES');
                console.log("UNLOCK ",table);
            }
        },
        insert: async (table, columns, params) => {
            var con = await pool.getConnection(async conn => conn);

            var sql = 'INSERT INTO ' + table + ' SET ? ';
            var insertObj = {};
            for (var i = 0; i < columns.length; i++) {
                insertObj[columns[i]] = params[i];
            }
            try {
                var lock_sql = 'LOCK TABLES '+table+' WRITE';
                con.query(lock_sql);
                console.log("LOCK ",table);
                var ret = await con.query(sql, insertObj);
                console.log('[insert->', table, '] Save Resolved : ', ret[0]);
                return [true, ret[0].insertId];
            } catch(err){
                console.log('[insert->', table, '] Save Rejected : ', err);
                return [false];
            }finally {
                con.release();
                con.query('UNLOCK TABLES');
                console.log("UNLOCK ",table);
            }
        },
        insert_all: async (table, params) => {
            var con = await pool.getConnection(async conn => conn);

            var day_block = ' (id_num, day, risk, probability) '
            if (table == "day_diabetes") {
                sql += 'day_diabetes' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_hepatitisa") {
                sql += 'day_hepatitisa' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_hepatitisb") {
                sql += 'day_hepatitisb' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_hepatitisc") {
                sql += 'day_hepatitisc' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_cirrhosis") {
                sql += 'day_cirrhosis' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_gastriculcer") {
                sql += 'day_gastriculcer' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_lungcancer") {
                sql += 'day_lungcance' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_lungdisease") {
                sql += 'day_lungdisease' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_myocardial") {
                sql += 'day_myocardial' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_stroke") {
                sql += 'day_stroke' + day_block + 'VALUES (?,?,?,?)';
            } else if (table == "day_depression") {
                sql += 'day_depression' + day_block + 'VALUES (?,?,?,?)';
            }
            try {
                var lock_sql = 'LOCK TABLES '+table+' WRITE';
                con.query(lock_sql);
                console.log("LOCK ",table);
                var ret = await con.query(sql, params);
                console.log('[insert_all->', table, '] Save Resolved : ', ret[0]);
                return [true, ret[0].insertId];
            } catch(err){
                console.log('[ERROR][insert_all->', table, '] Save Rejected : ', err);
                return [false];
            } finally {
                con.release();
                con.query('UNLOCK TABLES');
                console.log("UNLOCK ",table);
            }
        },
        select_from_id: async (id, wanted_column) => {
            var con = await pool.getConnection(async conn => conn);
            tmp = wanted_column[0];
            for(i=1;i<wanted_column.length;i++) tmp += ','+wanted_column[i];
            var sql = 'SELECT ' + tmp + ' FROM user WHERE id = "' + id +'"';
            try {
                // read lock
                // var ret = await con.query("LOCK TABLES user READ");
                // console.log(ret);
                console.log('[select_from_id] sql_query : ',sql);
                var ret = await con.query(sql);
                console.log('[select_from_id] result :', ret[0]);
                if(ret[0].length != 1) throw err;
                else {
                    console.log('[select_from_id] Id(',id,') Select success');
                    return [true, ret[0][0]];
                }
            } catch(err) {
                console.log('[ERROR][select_from_id] Id(',id,') : ', err);
                return [false];
            }finally {
                con.release();
                // con.query("UNLOCK TABLES");
            }
        },
        select_from_idnum: async (id_num, table, wanted_column) => {
            var con = await pool.getConnection(async conn => conn);
            tmp = wanted_column[0];
            for(i=1;i<wanted_column.length;i++) tmp += ','+wanted_column[i];
            var sql = 'SELECT ' + tmp + ' FROM ' + table + ' WHERE id_num = ' + id_num;
            try {
                // read lock
                // var ret = await con.query('LOCK TABLES '+table+' READ');
                // console.log(ret);
                console.log('[select_from_idnum] sql_query : ',sql);
                var ret = await con.query(sql);
                console.log('[select_from_idnum] result :', ret[0]);
                if (ret[0].length != 1) throw err;
                else{
                    console.log('[select_from_idnum->', table, '] Select success');
                    return [true, ret[0]];
                }
            } catch(err) {
                console.log('[ERROR][select_from_idnum->', table, '] Id(',id_num,') : ',err);
                return [false];
            }finally {
                con.release();
                // con.query('UNLOCK TABLES');
            }
        }, 
        // ex) mysql_dbc.update(connection, ret[1].id_num, 'logincount', ['failcount'], [login_ret[1]+1]);
        updateOne: async (id_num, table, wanted_column, new_params) => {
            var con = await pool.getConnection(async conn => conn);

            var sql = 'UPDATE ' + table + ' SET ';
            for (var i = 0; i < wanted_column.length; i++) {
                if (i < wanted_column.length - 1) sql += wanted_column[i] + '=' + new_params[i] + ',';
                else sql += wanted_column[i] + '=' + new_params[i];
            }
            sql += ' WHERE id_num = ' + id_num;
            try {
                console.log('[update] sql_query : ',sql);
                var ret = await con.query(sql);
                console.log('[update] result :', ret[0]);
                console.log('[update->', table, '] Update success');
                return [true, ret[0]];
            } catch(err){
                console.log('[ERROR][update->', table, '] Id(',id_num,') : ', err);
                return [false];
            }finally {
                con.release();
            }
        },

        update_all: async(id_num, table, new_params) => {
            var con = await pool.getConnection(async conn => conn);

            var sql = 'UPDATE ' + table + ' SET ';
            var old_params;
            if (table == "user") {
                old_params = ['pw', 'name', 'gender', 'area', 'age', 'phone', 'checked'];
            } else if (table == "logincount") {
                old_params = ['failcount', 'last_login']; 
            } else if (table == "disease_all") {
                old_params = ['diabetes', 'hepatitisA', 'hepatitisB', 'hepatitisC', 'cirrhosis', 'gastriculcer', 'lungcancer', 'lungdisease', 'myocardial', 'stroke', 'depression'];
            } else if (table == "disease_prefer") {
                old_params = []; 
            } else if (table == "diseaseag") {
                old_params = ['carstairs','HE_DMfh','HE_IHDfh','DE1_dg','DI1_dg','DI3_dg','bmi','age','gender','is_obesity','BD2_1','BS3_2','BS3_1','exercise','area','FPG','TG','leukocyte','total_colesterol','HDL','LDL','HbA','SBP','DBP','is_atrialFibrillation','PT_INR','bilirubin','creatinine','ammonia','AFP','albumin','platelet','DLD_serve','is_hypercholesterolemia','is_chemicHeartDisease','history_cancer','meal_reg','salt_pref','dr_5y'];
            } else if (table == "diseaseml") {
                old_params = ['age','gender','HE_fh','HE_HPfh','HE_HLfh','HE_IHDfh','HE_STRfh','HE_HBfh','HE_DMfh','BH2_61','DI1_dg','DI2_dg','DI3_dg','DJ4_dg','DI4_dg','DJ2_dg','DE1_dg','DE1_32','DC1_dg','DC2_dg','DC6_dg','DJ8_dg','DJ6_dg','DK8_dg','DK9_dg','DK4_dg','exercise','BO1_1','BP1','D_1_1','BE5_1','BS3_1','DI1_2','DI2_2','HE_ht','HE_wt','EC_wht_23','HE_sput2','BS3_2','Total_slp_wk','Total_slp_wd','BD2_1','BE3_33','bmi'];
            } else if (table == "disease_data") {
                old_params = ['age','gender','area','HE_fh','HE_HPfh','HE_HLfh','HE_IHDfh','HE_STRfh','HE_HBfh','HE_DMfh','BH2_61','DI1_dg','DI2_dg','DI3_dg','DJ4_dg','DI4_dg','DJ2_dg','DE1_dg','DE1_32','DC1_dg','DC2_dg','DC6_dg','DJ8_dg','DJ6_dg','DK8_dg','DK9_dg','DK4_dg','exercise','BO1_1','BP1','D_1_1','BE5_1','BS3_1','DI1_2','DI2_2','HE_ht','HE_wt','EC_wht_23','HE_sput2','BS3_2','Total_slp_wk','Total_slp_wd','BD2_1','BE3_33','bmi',
            'depSum','is_obesity','carstairs','FPG','TG','leukocyte','total_colesterol','HDL','LDL','HbA','SBP','DBP','is_atrialFibrillation','PT_INR','bilirubin','creatinine','ammonia','AFP','albumin','platelet','DLD_serve','is_hypercholesterolemia','is_chemicHeartDisease','history_cancer','meal_reg','salt_pref','dr_5y'];
            } else if (table == "day_diabetes") {
                old_params = ['day'];
            } else if (table == "day_hepatitisa") {
                old_params = ['day'];
            } else if (table == "day_hepatitisb") {
                old_params = ['day'];
            } else if (table == "day_hepatitisc") {
                old_params = ['day'];
            } else if (table == "day_cirrhosis") {
                old_params = ['day'];
            } else if (table == "day_gastriculcer") {
                old_params =['day'];
            } else if (table == "day_lungcancer") {
                old_params = ['day'];
            } else if (table == "day_lungdisease") {
                old_params =['day'];
            } else if (table == "day_myocardial") {
                old_params = ['day'];
            } else if (table == "day_stroke") {
                old_params = ['day'];
            } else if (table == "day_depression") {
                old_params = ['day'];
            }

            for (var i = 0; i < old_params.length; i++) {
                if (new_params[i] == 'None') {
                    sql += old_params[i] + '="None"';
                }  else  sql += old_params[i] + '=' + new_params[i];
                if (i < old_params.length - 1) sql += ', ';
            }
            sql += ' WHERE id_num = ' + id_num;
            try {
                console.log('[update_all] sql_query : ',sql);
                var ret = await con.query(sql);
                console.log('[update_all] result :', ret[0]);
                console.log('[update_all->', table, '] Update success');
                return [true, ret[0]];
            } catch(err){
                console.log('[ERROR][update_all->', table, '] Id(',id_num,') : ', err);
                return [false];
            }finally {
                con.release();
            }
        }

    }
};
/* MongoDB
const mongoose = require('mongoose');


// 애저
/* var url = 'mongodb://mongo105:gVbEHxPk3IWyLOOZLKhayS9SHC3NAlQCW9cb1wMaR0J74AbJq69r4pJH2ccWa5mER2ZWgHBfu9j9O4dtgRLVLw==@mongo105.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false'

module.exports = mongoose.connect(url,{useNewUrlParser: true}, function(err,client){
   if(err)
       console.log('Unable to connect to the mongoDB server.Error',err);
    else{
        console.log('Connected to MongoDB Server , WebService running on port 1337');
    }
});
*/
/*

module.exports = {
  db: {
    uri:
'mongodb://mongo105:gVbEHxPk3IWyLOOZLKhayS9SHC3NAlQCW9cb1wMaR0J74AbJq69r4pJH2ccWa5mER2ZWgHBfu9j9O4dtgRLVLw==@mongo105.documents.azure.com:10250/mean?ssl=true&sslverifycertificate=false'

// originally used code before mysql
var url = 'mongodb://localhost:27017/test'
module.exports = () => {
    function connect(){
        mongoose.connect(url, {useNewUrlParser: true}, function(err){
        console.log('connecting mongo db (port : 27017)...');
        if(err){
                console.error('mongodb connection error', err);
            }
        else console.log('mongodb connected');
        });
    }
    connect();
    var mongodb = mongoose.connection;
    mongodb.on('disconnected',connect);
    mongodb.on('error',function(err){
        console.log('MongoDB Error: ', err);
    });
    mongodb.on('open',function(){
        console.log('MongoDB Open Event')
    });
}
*/