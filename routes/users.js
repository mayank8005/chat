var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

module.exports = router;

var mongo= require('mongodb').MongoClient,
    client = require('socket.io').listen(8000).sockets;

mongo.connect('mongodb://127.0.0.1/users', function (err , db) {
    if(err) throw err;

    client.on('connection', function (socket) {

        var col = db.collection('messages'),
            sendStatus = function(s) {
              socket.emit('status',s);
            };
        //emit all messages
        col.find().limit(50).toArray(function(err, res){
           if(err) throw err;
           socket.emit('output',res);
        });
        //wait for input
        socket.on('input', function (data) {
            var name = data.name,
                message = data.message,
                whitespacePattern = /^\s*$/;
            if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
                sendStatus('name and message is required.');
            } else {
                col.insertOne({name: name, message: message}, function () {

                    //emit latest msg to all client
                    client.emit('output',[data]);
                    sendStatus({
                        message : "Messsage Sent",
                        clear: true
                    });
                });
            }
        });
    });
});



