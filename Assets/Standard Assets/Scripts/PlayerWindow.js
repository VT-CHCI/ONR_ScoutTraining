#pragma strict

private var windowSize : Rect = Rect (10,10,120,95);
private var title : String = "Player IP";
private var player : NetworkPlayer;
private var windowID: int = 3;

private var selGridInt : int = 99;
private var selStrings : String[] = ["Front", "Left", "Right", "Floor"];

private var show = false;

function init (windowXY : Vector2, playerInfo : NetworkPlayer, id : int, ready : boolean) {
	windowSize.x = windowXY.x;
	windowSize.y = windowXY.y;
	
	player = playerInfo;
	title = playerInfo.ipAddress;
	
	windowID = id;
	show = ready;
}

function playerActions (windowID: int) {
	GUI.Label (Rect (13, 20, 100, 20), "Choose Camera");

	selGridInt = GUI.SelectionGrid (Rect (10,45,100,40), selGridInt, selStrings, 2);
	
	switch(selGridInt) {
		case 0:
			print("Front");
			selGridInt = 99;
			networkView.RPC("changeCamera",player,"Front");
			break;
		case 1:
			print("Left");
			selGridInt = 99;
			networkView.RPC("changeCamera",player,"Left");
			break;
		case 2:
			print("Right");
			selGridInt = 99;
			networkView.RPC("changeCamera",player,"Right");
			break;
		case 3:
			print("Bottom");
			selGridInt = 99;
			networkView.RPC("changeCamera",player,"Bottom");
			break;
		default:
			break;
	}
}

function OnGUI () {
 	if (show) {
		GUI.Window (windowID, windowSize, playerActions, title);
	}	
}

@RPC
function changeCamera (position : String) {
	for (var camera : Camera in GameObject.Find("Cameras").GetComponentsInChildren(Camera)) {
		if (camera.name.Contains(position)) {
			camera.depth = 1;
		}
		else {
			camera.depth = 0;
		}
	}
}