var date = require('date-utils');
var config = require('./api_info_caIdx').caIdx;
var request = require('sync-request');
var mongo_db =  require('../config/db_config_mongo')();

module.exports = function () {
    return {
        check: async () => { // 오늘 지수 있는지 체크 
                var newDate = new Date();
                var today = newDate.toFormat('YYYYMMDD');
                console.log("today is [" + today + "] ");

                var projection = {_id:0};
   
                try{
                    var query = {today: Number(today)};
                    var ret = await mongo_db.mongo_find("caIdx",query, projection, 1);
                    if (!ret[0]) throw err;
                    console.log("api_config_check : "+JSON.stringify(JSON.parse(ret[1])[0]) + "\n");
                }catch(err){
                    console.log(err);
                    return false;
                }
                return true;
        },
        update: async () => {
            try {
                var newDate = new Date();
                var today_b1 = newDate.toFormat('YYYYMMDDHH24');
                var today_b2 = newDate.toFormat('YYYYMMDD');
                var int_today_b2 = Number(today_b2);
                var today_cold_index, tomorrow_cold_index, tDAT_cold_index;
                var today_asthma_index, tomorrow_asthma_index, tDAT_asthma_index;

                console.log("today is [" + today_b1 + "] ");

                var url_block = "?ServiceKey=" + config.serviceKey;
                url_block += "&pageNo=" + config.pageNo;
                url_block += "&numOfRows=" + config.numOfRows;
                url_block += "&areaNo=" + config.areaNo;
                url_block += "&dataType=" + config.dataType;
                url_block += "&time=" + today_b1;


                var cold_url = config.server_addr + config.cold_path + url_block;
                var asthma_url = config.server_addr + config.asthma_path + url_block;

                console.log("[caIdx_cold_url] : "+cold_url + "\n");
                
                var res = request('GET', cold_url);
                var res_body = res.getBody('utf-8');
                var body = JSON.parse(res_body); 
                if(body.response.header.resultCode == "00"){
                    console.log("[data]\nlast_update: "+body.response.body.items.item[0].date);
                    console.log("[caIdx_cold_url res.body] "+res_body+ "\n");
                    today_cold_index = body.response.body.items.item[0].today;
                    if (today_cold_index == "") today_cold_index = "0";
                    tomorrow_cold_index = body.response.body.items.item[0].tomorrow;
                    if (tomorrow_cold_index == "") tomorrow_cold_index = "0";
                    tDAT_cold_index = body.response.body.items.item[0].theDayAfterTomorrow;
                    if (tDAT_cold_index == "") tDAT_cold_index = "0";
                    console.log("caIdx_cold_url today, tomorrow, tDAT : "+ today_cold_index+", "+ tomorrow_cold_index+", "+tDAT_cold_index);
                }
                    
                console.log("[caIdx_asthma_url] : "+asthma_url + "\n");
                
                res = request('GET', cold_url);
                res_body = res.getBody('utf-8');
                body = JSON.parse(res_body); 
                if(body.response.header.resultCode == "00"){
                    console.log("[data]\n last_store: "+body.response.body.items.item[0].date);
                    console.log("[caIdx_asthma_url res.body] "+res.body+ "\n");
                    today_asthma_index = body.response.body.items.item[0].today;
                    if (today_asthma_index == "") today_asthma_index = "0";
                    tomorrow_asthma_index = body.response.body.items.item[0].tomorrow;
                    if (tomorrow_asthma_index == "") tomorrow_asthma_index = "0";
                    tDAT_asthma_index = body.response.body.items.item[0].theDayAfterTomorrow;
                    if (tDAT_asthma_index == "") tDAT_asthma_index = "0";
                    console.log("caIdx_asthma_url: today, tomorrow, tDAT : "+ today_asthma_index+", "+ tomorrow_asthma_index+", "+tDAT_asthma_index);
                }

                    var query = {today: int_today_b2};
                    var operator = { $set: {cold_index: today_cold_index, asthma_index: today_asthma_index}};
                    var options = { upsert: true };
                    var ret = await mongo_db.mongo_updateOne("caIdx", query, operator, options);
                    if(!ret[0]) throw err;

                    query = {today: int_today_b2+1};
                    operator = { $set: {cold_index: tomorrow_cold_index, asthma_index: tomorrow_asthma_index}};
                    ret = await mongo_db.mongo_updateOne("caIdx", query, operator, options);
                    if(!ret[0]) throw err;

                    query = {today: int_today_b2+2};
                    operator = { $set: {cold_index: tDAT_cold_index, asthma_index: tDAT_asthma_index}};
                    ret = await mongo_db.mongo_updateOne("caIdx", query, operator, options);
                    if(!ret[0]) throw err;

                    console.log("api_config_update complete.")
                
                    return [true];

            } catch (err) {
                console.log("[ERROR] api_config_caIdx update : ", err +"\n");
                return [false];
            }
        }
    }
}