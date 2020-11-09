var request = require('request');
var date = require('date-utils');
var config = require('./api_info_caIdx').caIdx;
var mongo_db =  require('../config/db_config_mongo')();

module.exports = function () {
    return {
        check: async () => {
                var newDate = new Date();
                var today = newDate.toFormat('YYYYMMDD');
                console.log("today is [ " + today + "] ");

                var projection = {_id:0};
   
                try{
                    var query = {today: today};
                    var ret = await mongo_db.mongo_find("caIdx",query, projection, 1);
                    if (!ret[0]) throw err;
                    console.log(ret[1]);
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

                console.log("today is [ " + today + "] ");

                var url_block = "?ServiceKey=" + config.serviceKey;
                url_block += "&pageNo=" + config.pageNo;
                url_block += "&numOfRows=" + config.numOfRows;
                url_block += "&areaNo=" + config.areaNo;
                url_block += "&dataType=" + config.dataType;
                url_block += "&time=" + today_b1;


                var cold_url = config.server_addr + config.cold_path + url_block;
                var asthma_url = config.server_addr + config.asthma_path + url_block;

                console.log("[caIdx_cold_url] : "+cold_url + "\n");
                
                request.get(cold_url, async (err, res)=>{
                    if(err) throw err;
                    console.log("[caIdx_url res.body] "+res.body+ "\n");
                    var body = JSON.parse(res.body);
                    if(body.response.header.resultCode == "00"){
                        console.log("[openAPI connection success]\n");
                        console.log("[data]\n last_store: "+body.response.body.items.item[0].date);
                        console.log("[data]\n coldIdx(today, tommor): "+body.response.body.items.item[0].date);
                        console.log("[data]\n last_store: "+body.response.body.items.item[0].date);
                        console.log("[caIdx_url res.body] "+res.body+ "\n");
                        var today_cold_index = body.response.body.items.item[0].today;
                        if (today_cold_index == "") today_cold_index = "0";
                        var tomorrow_cold_index = body.response.body.items.item[0].tomorrow;
                        if (tomorrow_cold_index == "") tomorrow_cold_index = "0";
                        var tDAT_cold_index = body.response.body.items.item[0].theDayAfterTomorrow;
                        if (tDAT_cold_index == "") tDAT_cold_index = "0";
                    }else throw err;
                })


                console.log("[caIdx_asthma_url] : "+asthma_url + "\n");
                
                request.get(asthma_url, (err, res)=>{
                    if(err) throw err;
                    console.log("[caIdx_asthma_url res.body] "+res.body+ "\n");
                    var body = JSON.parse(res.body);
                    if(body.response.header.resultCode == "00"){
                        console.log("[openAPI connection success]\n");
                        console.log("[data]\n last_store: "+body.response.body.items.item[0].date);
                        console.log("[data]\n coldIdx(today, tommor): "+body.response.body.items.item[0].date);
                        console.log("[data]\n last_store: "+body.response.body.items.item[0].date);
                        console.log("[caIdx_url res.body] "+res.body+ "\n");
                        var today_asthma_index = body.response.body.items.item[0].today;
                        if (today_asthma_index == "") today_asthma_index = "0";
                        var tomorrow_asthma_index = body.response.body.items.item[0].tomorrow;
                        if (tomorrow_asthma_index == "") tomorrow_asthma_index = "0";
                        var tDAT_asthma_index = body.response.body.items.item[0].theDayAfterTomorrow;
                        if (tDAT_asthma_index == "") tDAT_asthma_index = "0";
                    }else throw err;


                    var query = {today: today_b2};
                    var operator = {cold_index: today_cold_index, asthma_index: today_asthma_index};
                    mongo_db.mongo_updateOne("caIdx", query, operator);

                    query = {today: String(int_today_b2+1)};
                    operator = {cold_index: tomorrow_cold_index, asthma_index: tomorrow_asthma_index};
                    mongo_db.mongo_updateOne("caIdx", query, operator);

                    query = {today: String(int_today_b2+2)};
                    operator = {cold_index: tDAT_cold_index, asthma_index: tDAT_asthma_index};
                    mongo_db.mongo_updateOne("caIdx", query, operator);
                })
            } catch (err) {
                console.log("[ERROR] api_config_caIdx update : ", err +"\n");
                throw err;
            }
        }
    }
}