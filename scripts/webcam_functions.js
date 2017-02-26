// Variables
var ws = undefined; // websocket instance
var logs = [];
var logsLimit = 4;
var b = document.getElementById('btnWS');
var timer = document.getElementById("times");
var pic=document.getElementById('pic');

// Initialize the WebSocket
function initWebSocket() {
    var ipName = window.location.hostname;
    if (ws) {
        ws.close(); // close the websocket if open.
        ws = undefined;
    }
    ws = new WebSocket('ws://' + ipName + '/stream');

    ws.onopen = function () { // when handshake is complete:
        log('WebSocket open to ZentriOS device ' + ipName);
        //*** Change the text of the button to read "Stop Webcam" ***//
        b.textContent = "Stop Webcam";
        //*** Change the title attribute of the button to display "Click to stop webcam" ***//
        b.title = "Click to stop webcam";
        //*** Enable the button" ***//
        b.disabled = false;
        
    };

    ws.onclose = function () { // when socket is closed:
        log('WebSocket connection to ' + ipName + ' has been closed!');
        //*** Change the text of the button to read "Start Webcam" ***//
         b.textContent = "Start Webcam";
        //*** Change the title attribute of the button to display "Click to start webcam" ***//
         b.title = "Click to start webcam";
        //*** Enable the button" ***//
        b.disabled = false;
        
    };

    ws.onmessage = function (event) { // when client receives a WebSocket message:
        //*** Display a new timestamp ***//
        timer.innerHTML = event.timeStamp;  //unsure
        //*** Set the source of the image to the image on the WiFi chip ***//
        pic.src="img.jpg?rand="+Math.random();
    };
	
	ws.onerror = function () { // when an error occurs
		ws.close();
		log('Websocket error');
        //*** Change the text of the button to read "Start Webcam" ***//
		 b.textContent = "Start Webcam";
        //*** Change the title attribute of the button to display "Click to start webcam" ***//
		 b.title = "Click to start webcam";
        //*** Enable the button" ***//
		 b.disabled = false;
	}
}

// Set up event listeners
//*** When the button is clicked, disable it, and depending on whether a Websocket is open or not, either run "initWebSocket()" or "ws.close()" ***//
function change(e)
{
    b.disabled = true;
    if(ws)
        initWebSocket();
    else
        ws.close();
}


// Other functions
function log(txt) {
    logs.push({
        'content': txt,
        'type': 'log'
    });
    showLog(logs, 'log', logsLimit);
}

function showLog(logArray, logId, logLimit) {
    var logContent = '';
    var logLength = logArray.length;
    var iStart = logLength - logLimit - 1;
    if (iStart < 0) {
        iStart = 0;
    }
    for (var index = iStart; index < logLength; ++index) {
        logItem = logArray[index];
        logContent += '<span class="' + logItem.type + '">' + logItem.content + '</span><br/>\n'
    }
    document.getElementById(logId).innerHTML = logContent;
}

// Define initialization function
function init() {
    initWebSocket();
}

// Open Websocket as soon as page loads
window.addEventListener("load", init, false);
