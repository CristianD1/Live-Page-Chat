
// global DOM Objects
var objMsgButton = $("#submitMsgButton");
var objEnteredText = $("#enteredText");
var objChatText = $("#chatText");
var userName = "Username";

// global objects
/*var msgPacket = {
  sender: 
}*/

window.onload = function() {
  
};

// Events
$(objEnteredText).keyup(function (e) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode === 13){
    createMsgPacket();
  }
});
objMsgButton.click(function(){
  createMsgPacket();
});

var createMsgPacket = function(){
  
  // RUN MSG PROCESSING
  // SEND TO SERVER
  
  // RETRIEVE RESPONSE
  
  // push to chat
  addMsgToChat("user");
}

var addMsgToChat = function(senderType){
  
  var chatDisplayText = objChatText.text();
  var enteredText = objEnteredText.val().replace(/(\r\n|\n|\r)/gm,"");
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
                              userName+" - "+time+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>')
    // End card creation
    
    objChatText.animate({ scrollTop: objChatText.prop("scrollHeight")}, 250);
    
    objEnteredText.val("");
  }
}
