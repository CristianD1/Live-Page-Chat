
// global DOM Objects
var objMsgButton = $("#submitMsgButton");
var objEnteredText = $("#enteredText");
var objChatText = $("#chatText");

var objNameText = $("#User_Name");

var localName = objNameText.val();


// global objects
/*var msgPacket = {
  sender: 
}*/

window.onload = function() {
  
};

// Events
objNameText.change(function(){
  var prevName = objNameText.val();
  localName = (prevName != "")?prevName:"Anon";
  objNameText.val(localName);
  
  chrome.runtime.sendMessage(
    {
      packetType: 'left chat',
      sender: prevName,
      location: window.location.href
    }, function(response){console.log(response);});
  chrome.runtime.sendMessage(
    {
      packetType: 'joined chat',
      sender: localName,
      location: window.location.href
    }, function(response){console.log(response);});
  
});
objEnteredText.keyup(function (e) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode === 13){
    createMsgPacket();
  }
});
objMsgButton.click(function(){
  createMsgPacket();
});

var createMsgPacket = function(){
  
  var theMsg = objEnteredText.val().replace(/(\r\n|\n|\r)/gm,"");
  
  // RUN MSG PROCESSING
  // SEND TO SERVER
  // testing msg push
  chrome.runtime.sendMessage(
    {
      packetType: "user message", 
      message: theMsg, 
      sender: localName,
      location: window.location.href
    },
    function(response){console.log(response);});
  
  // RETRIEVE RESPONSE
  
  // push to chat
  addMsgToChat("user", theMsg);
}

var addMsgToChat = function(senderType, message){
  
  var chatDisplayText = objChatText.text();
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
    var time = dt.getHours()%12 + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    
    objChatText.append('<div class="row">'+
                        '<div class="col s12">'+
                          '<div class="card messageCard '+msgClass+'">'+
                            '<div class="card-content" value="">'+
                              enteredText+
                            '</div>'+
                            '<div class="card-action extraInfo">'+
                              localName+" - "+time+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>')
    // End card creation
    
    objChatText.animate({ scrollTop: objChatText.prop("scrollHeight")}, 250);
    
    objEnteredText.val("");
  }
}
