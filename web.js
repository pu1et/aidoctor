const express = require('express');
const http = require('http');
const bodyParser= require('body-parser');

const day_caIdx = require('./api/caIdx')();
const mysql_dbc = require('./api/mysql')();
const mongo_db =  require('./api/mongodb')();
const cron = require('./cron/caIdx')();

// 크론 작업 실행
day_caIdx.update();
cron.init();

// DB 테스트
mysql_dbc.init();
mysql_dbc.test_open();
mongo_db.test_open();

const app = express();

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');
const userRoutes = require('./routes/user');

// 미들웨어 설정 파트
app.set('port',process.env.PORT || 1337);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// 라우팅 파트
app.use('/', indexRoutes);
app.use('/api',apiRoutes);
app.use('/user', userRoutes);

var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("web server on ... "+ app.get('port')); 
});
