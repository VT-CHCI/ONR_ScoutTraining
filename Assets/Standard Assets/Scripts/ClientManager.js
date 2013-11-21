#pragma strict

import System.Xml;
import System.IO;

private var useNat = false;
private var inCave = true;
private var endClient = false;

private var players = new Array();

public var AR = false;

function setCamera (position: String) {
	for (var camera : Camera in Camera.allCameras) {
		if (camera.name.Contains(position)) {
			camera.enabled = true;
		}
		else {
			camera.enabled = false;
		}
	}
}

function Start() {
	//var asset:TextAsset = Resources.Load("config");
	
	
	//print (Application.dataPath);
	
	if (!AR) { 
		var debugger:Debugger = gameObject.GetComponent("Debugger");
		debugger.setText(Application.dataPath);
		
		var asset:String;
		
		if (System.IO.File.Exists(Application.dataPath+"/Resources/config.xml")) {
			asset = System.IO.File.ReadAllText(Application.dataPath+"/Resources/config.xml");
			
			if(asset != null) {
		        var reader:XmlTextReader = new XmlTextReader(new StringReader(asset));
		        while(reader.Read()) {
		            if(reader.Name == "wallPosition") {
		            	setCamera(reader.GetAttribute("label"));
		            }
		            if(reader.Name == "wallResolution") {
		            	var fullscreen:boolean;
		            	
		            	if (reader.GetAttribute("fullscreen") == true) {
		            		fullscreen = true;
		            	} else {
		            		fullscreen = false;
		            	}
		            	
		            	Screen.SetResolution(int.Parse(reader.GetAttribute("width")),int.Parse(reader.GetAttribute("height")),fullscreen);
		            }
		        }
		    }
	    
			debugger.setText("Found external config");
		} else {
			debugger.setText("Using internal config");
		}
	} else {
		setCamera("AR");
	}
    
    
	Network.Connect("console.sv.vt.edu", 30001);
}

function Update() {
    if (Input.GetKeyDown(KeyCode.Escape)) {
        quitApp();
    }
}

function quitApp() {
	Application.Quit();
}

// Messages
function OnFailedToConnect(error : NetworkConnectionError) {
	Debug.Log("Could not connect to server: "+ error);
	
	inCave = false;
	if (!inCave && !endClient) {
		Network.Connect("127.0.0.1", 25001);
		endClient = true;
	} else {
		Debug.Log("Could not connect to either server, quitting app");
		quitApp();
	}
}

function OnConnectedToServer() {
	Debug.Log("Connected to server");
	// Send local player name to server ...
}

function OnDisconnectedFromServer () {
	quitApp();
}