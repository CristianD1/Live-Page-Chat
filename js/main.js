
var objMsgButton = $("#submitMsgButton");
var objEnteredText = $("#enteredText");
var objChatText = $("#chatText");


window.onload = function() {
  
};

// Events
$(objEnteredText).keyup(function (e) {
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode === 13){
    addMsgToChat();
  }
});
objMsgButton.click(function(){
  addMsgToChat();
});

var addMsgToChat = function(){
  var chatDisplayText = objChatText.val();
  var enteredText = objEnteredText.val();
  
  objChatText.val( chatDisplayText ? chatDisplayText+"\n"+enteredText : enteredText );
  
  objChatText.animate({ scrollTop: objChatText.prop("scrollHeight")}, 250);
  
  objEnteredText.val("");
}
