#pragma downcast

import System.Text.RegularExpressions;

private var windowSize : Rect = Rect (20, Screen.height - 220, 200, 200);
private var avatarSize = 15;
private var caveSize = 200;
private var center = 118;

private var mdown = false;
private var t1 : Rect = Rect (caveSize/2 - avatarSize/2,caveSize/2 - avatarSize/2,avatarSize,avatarSize);

public var cave : GameObject;
public var caveWidth = 2.5;

private var windowRect : Rect = Rect (Screen.width - 220, Screen.height - 150, 200, 130);
private var selStrings : String[] = ["Front Top", "Front Bottom", "Left Top", "Left Bottom", "Right Top", "Right Bottom", "Floor Top", "Floor Bottom"];
private var selGridInt = 0;
private var selGridCheck = 0;

public var cameras : GameObject;

function Start() {
	cameras = GameObject.Find("Cameras");
	cave = GameObject.Find("Walls");
}

// Make the contents of the window
function caveSim (windowID : int) {
	var fMouseX : float = Input.mousePosition.x;
    var fMouseY : float = 235-Input.mousePosition.y;

	if (t1.Contains(Event.current.mousePosition)) {
		if (Event.current.type == EventType.MouseDown && mdown==false) {
		    mdown=true; 
		    return;
		}
		if (Event.current.type == EventType.MouseUp && mdown==true) {
		    mdown=false;
		}
	}

    if (mdown) {
		t1 = Rect(fMouseX-25, fMouseY-25, 15, 15);//notice the -25, did this so the button would center on my cursor, otherwise it grabs on the top left corner. Based off of the size of your button of course
    	
    	if (null != cave) {
    		cave.transform.localPosition = Vector3(2.5*(118-fMouseX)/118,-1,-2.5*(118-fMouseY)/118);
    	}
    }
    GUI.Button (Rect(t1), "X");
}

function viewCamera (position: String) {
	for (var camera : Camera in cameras.GetComponentsInChildren(Camera)) {
		if (camera.name.Contains(position)) {
			camera.depth = 1;
			camera.enabled = true;
		}
		else {
			camera.depth = 0;
			camera.enabled = false;
		}
	}
}

function cameraChooser (windowID: int) {
	selGridInt = GUI.SelectionGrid (Rect (10,25,180,100), selGridInt, selStrings, 2);
}

function OnGUI () {
	GUI.Window (0, windowSize, caveSim, "CAVE View");
	//GUI.Window (1, windowRect, cameraChooser, "Camera Select");
	GUI.Window (1, windowRect, cameraChooser, "Camera Select");
}

function Update() {

	if (selGridInt != selGridCheck) {
		//print(selStrings[selGridInt]);
		selGridCheck = selGridInt;
		
		var line = selStrings[selGridInt];
		line = Regex.Replace(line, "( )+", "");
		
		viewCamera(line);
	}
}