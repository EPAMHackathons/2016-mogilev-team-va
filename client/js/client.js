
    var exampleSocket = new WebSocket("wss://racing-vnovikov.c9users.io/");
    var clientId;
     
   navigator.vibrate = navigator.vibrate ||
        navigator.webkitVibrate ||
        navigator.mozVibrate || 
        navigator.msVibrate;
        
	exampleSocket.onmessage = function (event) {
        var eventData = JSON.parse(event.data);
        if(eventData.type == 'clientId') {
            clientId = eventData.data.value;

            exampleSocket.send(JSON.stringify({
                type: 'connect',
                data: {
                    clientId: clientId,
                    shipType: window.sessionStorage.shipType,
                    nick: window.sessionStorage.nick,
                    color: 'red'
                }
            })); 
        } else if(eventData.type == 'hit') {
        	navigator.vibrate(300);
        } else if(eventData.type == 'killed') {
        	navigator.vibrate(800);
        	var a = document.getElementById('status');
        	a.innerHTML = '<p>GAME OVER</p><button onclick="restart()" class="btn">RESTART</button>';
        }
    }
    
    function fire(e){
	    var data = {
	        type: 'fire',
	        data: {
	            clientId: clientId,
	            value: true
	        }
	    }
		exampleSocket.send(
		    JSON.stringify(data)
		); 
	}

		
	function gasStart(e){
	    var data = {
		    type: 'acc',
		    data: {
		        clientId: clientId,
		        value: true
		    }
		}
		exampleSocket.send(
		    JSON.stringify(data)
		); 
	}
	
	function gasStop(e){
	    var data = {
		    type: 'acc',
		    data: {
		        clientId: clientId,
		        value: false
		    }
		}
		exampleSocket.send(
		    JSON.stringify(data)
		); 
	}
	
	function restart(){
            exampleSocket.send(JSON.stringify({
                type: 'connect',
                data: {
                    clientId: clientId,
                    shipType: window.sessionStorage.shipType,
                    nick: window.sessionStorage.nick,
                    color: 'red'
                }
            }));
            var a = document.getElementById('status');
        	a.innerHTML = '';
	}
	
	gyro.frequency = 10;
	var currentPosition = 0;
	gyro.startTracking(function(o) {
		var newPosition = o.beta/7 | 0;
		if(currentPosition != newPosition) {
    	    exampleSocket.send(JSON.stringify({
    	        type: 'rotate',
			    data: {
			        clientId: clientId,
			        value: newPosition
			    }
			}));
			currentPosition = newPosition;
		}

	});
    
    window.onload = function(){
		var accButton = document.getElementById('acc');
		accButton.addEventListener("touchstart", gasStart, true);
		accButton.addEventListener("touchend", gasStop, true);
		
		var fireButton = document.getElementById('fireButton');
		fireButton.addEventListener("touchstart", fire, true);
    };