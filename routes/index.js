var router = require('express').Router();

router.get('/', function (req, res) {
    res.end("Node-Android-Project");
    console.log("this is default directory");
});

router.post('/', function (req, res) {
    res.end("Node-Android-Project");
    console.log("this is default directory");
});

module.exports = router; 
