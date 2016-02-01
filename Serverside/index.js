var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var uid = 0;
var userList = [];

app.get('/', function(req, res){
  res.sendFile('index.html');
});

io.on('connection', function(socket){

  socket.on('joined chat', function(sen, loc, uidArg){
    if(uidArg === null){
      uidArg = findAvailableUID();
    }
    console.log('{action: joined, uid: '+uidArg+', sender: '+sen+', location: '+loc+'}');
    userList[uidArg] = { lastAction: 'joined',
                         username: sen,
                         location: loc };
    uid = uidArg;
    socket.emit('action event', 'action|playerList||'+makeUserList());
    //socket.emit('action event', 'action|joined||uid|'+uidArg+'||sender|'+sen+'||location|'+loc);
  });

  socket.on('left chat', function(sen, loc, uidArg){
    console.log('{action: left, uid: '+uidArg+', sender: '+sen+', location: '+loc+'}');
    userList[uidArg] = {};

    socket.emit('action event', 'action|playerList||'+makeUserList());
    //socket.emit('action event', 'action|left||uid|'+uidArg+'||sender|'+sen+'||location|'+loc);
  });

  socket.on('chat message', function(sen, msg, loc, uidArg){
    console.log('{action: message, uid: '+uidArg+', sender: '+sen+', message: '+msg+', location: '+loc+'}');

    socket.emit('action event', 'action|msg||uid|'+uidArg+'||sender|'+sen+'||location|'+loc+'||message|'+msg);
  });

});

var makeUserList = function(){
 var userListString = '';
 var uidItem = {};
 for ( uidItem in userList ){
  var cu = userList[uidItem];
  if(cu !== {}){
   userListString += '{}uid|'+uidItem+'||sender|'+cu.cusername+'||location|'+cu.location;
  }
 }
 return userListString;
}

var findAvailableUID = function(){
  var tempUID = uid;
  while(uid in userList || userList[uid] !== {}){
    tempUID ++;
  }
  return tempUID;
}

http.listen(3030, function(){
  console.log('listening on *:3030');
});

