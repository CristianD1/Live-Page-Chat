window.onload = function() {
  console.log( $('#enterText').value  );
};

// bindings
document.getElementById("submitMsgButton").addEventListener("click",submitMsg);

function submitMsg(){
  document.getElementById('chatText').value += "\n" + document.getElementById('enterText').value;
  document.getElementById('enterText').value = "";
}

