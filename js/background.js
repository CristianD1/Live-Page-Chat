/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
 
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 500, height: 500}
    }
  );
  
  socket = io.connect('http://170.75.162.21:3000');
  
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
    
      if( request.packetType === 'joined chat' ){
        socket.emit('joined chat', request.sender, request.location);
      }
    
      if( request.packetType === 'left chat' ){
        socket.emit('left chat', request.sender, request.location);
      }
    
      if( request.packetType === 'user message' ){
        socket.emit('chat message', request.sender, request.message, request.location); 
      }
    
  });
  
});