#pragma strict

public var server = true;
private var useNat = false;
private var windowCounter = 3;

public var cameras : GameObject;

private var players = new Array();

function Start() {
	if (server) {
		startServer();
	}
	else {
		Network.Connect("127.0.0.1", 25001);
	}
}

function Update() {
    if (Input.GetKeyDown(KeyCode.Escape)) {
        quitApp();
    }
    
    if (Input.GetKeyDown(KeyCode.H)) {
    	print('i am here');
    }
}

function quitApp() {
	Application.Quit();
}

// Server code

function startServer() {
	Network.InitializeServer(8, 25001, useNat);
}

function OnPlayerConnected(player: NetworkPlayer) {
	players.Add(player);
	
	var test = new GameObject();
	test.AddComponent(NetworkView);
	
	var testScript = test.AddComponent(PlayerWindow);
	testScript.init(Vector2(10,10), player, windowCounter, true);
	
	windowCounter++;
	
	Debug.Log("Player connected from " + player.ipAddress + ":" + player.port);
	// Populate a data structure with player information ...
}

// Messages
function OnServerInitialized() {
	Debug.Log("Server Initialized!");
}

// Client code

// Messages
function OnFailedToConnect(error : NetworkConnectionError) {
	Debug.Log("Could not connect to server: "+ error);
}

function OnConnectedToServer() {
	Debug.Log("Connected to server");
	// Send local player name to server ...
}
