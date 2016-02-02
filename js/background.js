/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
 console.log('lol');
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  console.log('hibob');
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 500, height: 500}
    }
  );
  
  socket = io.connect('http://170.75.162.21:3030');
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
      console.log("hi im in the background");
      if( request.packetType === 'joined chat' ){
        socket.emit('joined chat', request.sender, request.location, request.uid);
      }
    
      if( request.packetType === 'left chat' ){
        socket.emit('left chat', request.sender, request.location, request.uid);
      }
    
      if( request.packetType === 'chat message' ){
        console.log("im receiving stuff");
        socket.emit('chat message', request.sender, request.message, request.location, request.uid); 
      }
  });
  
  socket.on('action event', function(msg){
    // msg of the form: action|*||uid|*||sender||*|location||*
    var infoSet = msg.split("||");
    var action = infoSet[0].split("|")[1];
    
    if(action === 'msg'){
      
      chrome.runtime.sendMessage(
        {
          action: action,
          uid: infoSet[1].split("|")[1],
          sender: infoSet[2].split("|")[1],
          location: infoSet[3].split("|")[1],
          message: (action === 'msg')? infoSet[4].split("|")[1] : ""
        }, function(response){console.log(response);});
        
    }else if(action === 'playerList'){
      
      chrome.runtime.sendMessage(
        {
          action: action,
          userList: infoSet[1],
        }, function(response){console.log(response);});
        
    }
  });
  
});