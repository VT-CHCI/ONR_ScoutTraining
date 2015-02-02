#pragma strict

private var useNat = false;

private var windowCounter = 3;
private var players = new Array();

public var showCaveSim = false;

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
	setCamera("ServerView");
	
//	gameObject.AddComponent(MouseLook);
//	gameObject.AddComponent(FPSInputController);
	
	if (showCaveSim)
		gameObject.AddComponent(CaveSimulator);
	
	startServer();
}

function Update() {
    if (Input.GetKeyDown(KeyCode.Escape)) {
        quitApp();
    }
}

function quitApp() {
	Application.Quit();
}

function startServer() {
	Network.InitializeServer(12, 30001, useNat);
}

function OnPlayerConnected(player: NetworkPlayer) {
	/*
	players.Add(player);
	
	var test = new GameObject();
	test.AddComponent(NetworkView);
	
	var testScript = test.AddComponent(PlayerWindow);
	testScript.init(Vector2 (10,10), player, windowCounter, true);
	
	windowCounter++;
	
	Debug.Log("Player connected from " + player.ipAddress + ":" + player.port);
	*/
}

// Messages
function OnServerInitialized() {
	Debug.Log("Server Initialized!");
}