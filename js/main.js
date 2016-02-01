
// global DOM Objects
var objMsgButton = $("#submitMsgButton");
var objEnteredText = $("#enteredText");
var objChatText = $("#chatText");

var objNameText = $("#User_Name");

var userList = {
  //    userCount: 
  //    uid: {
  //      username: ,
  //      userLocation: ,
  //    } 
};

var currUserInfo = {
  uid: null,
  username: objNameText.val(),
  userLocation: window.location.href,
};

// Deal with any message received from the server
chrome.runtime.onMessage.addListener(function(info) {
  
  switch(info.action){
    case 'userList':
      console.log("Userlist found: "+info.userList);
      /*info = {action, userList}*/
      /*userList = '{}uid|*||sender|*||location|*{}uid|*||sender|*||location|*'*/
      var tUserList = info.userList.split('{}');
      var tUserCount = userList.length;
      
      for(var i = 0; i < tUserCount; i++){
        if(tUserList[i] !== ''){
          var tUserInfoSplit = tUserList[i].split('||');
          
          var tUid = tUserInfoSplit[0].split('|')[1];
          userList[tUid] = {
            username: tUserInfoSplit[1].split('|')[1],
            userLocation: tUserInfoSplit[2].split('|')[1]
          };
        }
      }
    
      break;
    case 'msg':
      /*info = {action, uid, sender, location, message, userList}*/
      console.log("msg found: " + info.message)
    
      break;
    default:
     
  }
  
});


// Deal with name changing
objNameText.change(function(){
  var prevName = currUserInfo.username;
  var t = objNameText.val();
  currUserInfo.username = (t != "")? t : prevName;
  objNameText.val(currUserInfo.username);
  
  chrome.runtime.sendMessage(
    {
      packetType: 'left chat',
      sender: prevName,
      uid: currUserInfo.uid,
      location: currUserInfo.userLocation
    }, function(response){console.log(response);});
    
  // uid should be re-assigned here  
  chrome.runtime.sendMessage(
    {
      packetType: 'joined chat',
      sender: currUserInfo.username,
      uid: currUserInfo.uid,
      location: currUserInfo.userLocation
    }, function(response){console.log(response);});
});
// Deal with pressing the enter key to submit a message
objEnteredText.keyup(function (e) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode === 13){
    createMsgPacket();
  }
});
// Deal with pressing the submit button
objMsgButton.click(function(){
  createMsgPacket();
});

// Given a message event, create a message packet and send it to the server
var createMsgPacket = function(){
  var theMsg = objEnteredText.val().replace(/(\r\n|\n|\r)/gm,"");
  console.log("here: " + theMsg+" "+currUserInfo.uid+" "+currUserInfo.username)
  chrome.runtime.sendMessage(
    {
      packetType: "user message", 
      message: theMsg, 
      sender: currUserInfo.username,
      uid: currUserInfo.uid,
      location: currUserInfo.userLocation
    },
    function(response){console.log(response);});
}

var addMsgToChat = function(senderType, message){

  var enteredText = message;
  var msgClass = "";
  
  var errorMsg = "";
  
  
  switch(senderType){
    case "user":
      msgClass = "myMsg";
      break;
    case "server":
      msgClass = "publicMsg";
      break;
    default:
      msgClass = "errorMsg";
  }

  // Error checking
  if ( !enteredText ) {
    errorMsg += "No text entered.";
  }

  if( !errorMsg ) {
    // Create card object that contains the message and add it to the message display card
    var dt = new Date();
    var time = dt.getHours()%12 + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    
    objChatText.append('<div class="row">'+
                        '<div class="col s12">'+
                          '<div class="card messageCard '+msgClass+'">'+
                            '<div class="card-content" value="">'+
                              enteredText+
                            '</div>'+
                            '<div class="card-action extraInfo">'+
                              currUserInfo.username+' - '+time+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>')
    // End card creation
    
    objChatText.animate({ scrollTop: objChatText.prop("scrollHeight")}, 250);
    
    objEnteredText.val("");
  }
}
