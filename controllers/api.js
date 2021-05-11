var mongo_db =  require('../api/mongodb')();

exports.postCold = (req, res, next) => {
    console.log('\n/api/cold\n'+req.body);

    var today = Number(req.body.today);
   
    try{
        var query = {today: today};
        var ret = await mongo_db.mongo_findOne("caIdx",query);
        if (!ret[0]) throw err;
        console.log("send",ret[1]);
        res.status(200).send({result:'1', data: ret[1]});
    }catch(err){
        console.log(err);
        res.status(500).send({ result: '0' });
    }
}