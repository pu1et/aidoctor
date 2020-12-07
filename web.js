const express = require('express');
const http = require('http');
const bodyParser= require('body-parser');
const app = express();

route = require('./route/routes.js');

app.set('port',process.env.PORT || 1337);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', route);

console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\n")
console.log("\n===========================================================================\n")
var server = http.createServer(app).listen(app.get('port'),function(){
   console.log("web server on ... "+ app.get('port')); 
});
