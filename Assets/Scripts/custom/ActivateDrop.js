#pragma strict

import UnityEngine.UI;
import System.Collections.Generic;

/*
	Time:
	- Used to calculate speed of descent of the crate
	- Used as offset to Time.time for extra crate drops
*/
private var startTime : float;
private var timerOffset : float;

/*
	Strings & Vector3:
	- (x, y, z) coordinate Strings (to be converted to floats) that
	  grabbed from TextFields
	- Vector3 that contains the drop coordinates
*/
private var xInput : String; 
private var yInput : String;
private var zInput : String;
private var inputC : Vector3;

/*
	Booleans:
	- Accurate v.s Probability-based crate drop
	- UI coordinate-input system
	- Whether or not user has clicked the UI button to drop the crate
	- Whether or not the user has clicked the mouse to drop the crate
*/
private var rToggle = true;
private var fToggle = false;
private var buttonCheck = false;
private var clickCheck = false;

/*
	World Objects:
	- The crate that will be dropped
	- The beacon that indicates where to drop the crate
	- The "hand" object that is following the wand position
	- The LineRenderer that will show the user where their mouse is in the world
*/
var crate : GameObject;
var beacon : GameObject;
var hand : GameObject;
private var mouseR : LineRenderer;

/*
	Delta Position:
	- Manages the speed of the Lerp function that is "dropping" the crate
*/
private var delta = 0.0;

/*
	RNG:
	- Used to calculate probability percentages
*/
var random : Random;

/*
	Finds:
	- Crate, Beacon, and LineRenderer objects
	- Sets the crate to be invisible until drop
	- Records the initial time
	- Initializes random number generator for probability curve
*/
function Start () {
	crate.renderer.enabled = false;


	mouseR = hand.GetComponent(LineRenderer);
	
	startTime = Time.time;
	
	random = new Random();
	
	// mouseR.useWorldSpace = true;
}

/*
	Checks for:
	- Boolean toggle for UI coordinate-input system
	- Boolean toggle for accurate crate drop
	- Reset the crate and allow more drops
	- Continue to check for mouse input if user hasn't clicked yet
	- If the proper booleans are true, start the crate drop
*/
function Update () {
	if(Input.GetKeyDown (KeyCode.F1)) {
		fToggle = fToggle ? false : true;
	}
	
	else if(Input.GetKeyDown (KeyCode.F2)) { 
		rToggle = rToggle ? false : true;
	}
	
	else if(Input.GetKeyDown (KeyCode.F3)) {
		crate.renderer.enabled = false;
		clickCheck = false;
	}
	
	else if(!clickCheck) {
//		resetTimer();
//		drawMouseRay();
//		
//		if(!rToggle) {
//			calculateArea(inputC, new List.<float>([.68, .95, .997]));
//		}
	}
	
	else if(buttonCheck || clickCheck) {
		//onWandPress();
		//ReleaseCrate(rToggle, inputC, 10);
	}
	
	// drawLineRenderer();
}

/*
	UI System:
	- Three float coordinate values (x, y, z)
	- Button press to start the crate drop
*/
function OnGUI() {
	if(fToggle) {
		xInput = GUI.TextField (Rect (Screen.width - 160, 30, 160, 30), xInput);
		yInput = GUI.TextField (Rect (Screen.width - 160, 60, 160, 30), yInput);
		zInput = GUI.TextField (Rect (Screen.width - 160, 90, 160, 30), zInput);

		if(GUI.Button (Rect (Screen.width - 160, 123, 80, 33), "Drop Crate")) { 
			if(float.TryParse(xInput, inputC.x) && float.TryParse(yInput, inputC.y) && 
				float.TryParse(zInput, inputC.z)) {
				buttonCheck = true;
			}
		}
	}
}

/*
	Wrapper Function:
	- Allows the wand to call the ReleaseCrate function using a broadcasted message
*/
function onWandPress() {
	resetTimer();
	drawMouseRay();
	
	if(!rToggle) {
		calculateArea(inputC, new List.<float>([.68, .95, .997]));
	}
	
	ReleaseCrate(rToggle, inputC, 10);
}

/*
	Crate Drop:
	- Checks to make sure the crate object isn't missing
	- Moves the crate to the proper position above the drop point
	- Makes the crate visible and starts calculating position delta values
	- Start "dropping" the crate
*/
function ReleaseCrate (toggle : boolean, targetP : Vector3 , t : float) {
	if(crate != null) {
		crate.transform.position = Vector3(targetP.x - 30, targetP.y + 200, targetP.z);
		crate.renderer.enabled = true;
		delta = ((Time.time - startTime - timerOffset) / t);
		
		crate.transform.position = Vector3.Lerp(crate.transform.position, targetP, delta);
	}
}

/*
	Mouse Tracking:
	- Initialize the ray extending from the MainCamera based on the mouse position
	- Declare the hit object and intersection point vector
	- Shoots the ray from the camera to the mouse position looking for collision hits
	- Update the LineRenderer to follow the mouse
	- Update the vectors to reference the intersection point and toggle the mouse click boolean
*/
function drawMouseRay() {
	//Personal Note: There might be no main camera, might be tagged as something else
	//var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var ray : Ray = new Ray(hand.transform.localPosition, hand.transform.forward);
	var target : RaycastHit;
	var intersect : Vector3;
	
	if(Physics.Raycast(ray, target, Mathf.Infinity)) {		
		//if(Input.GetMouseButtonDown(0)) {
			intersect = Vector3(target.point.x, target.point.y, target.point.z);
			intersect.y = findAt(intersect).y + 0.5;
			Debug.Log(intersect);
			inputC = intersect;
			clickCheck = true;
		//}
	}
}

/*
	Probability Calculation:
	- Takes a vector position and list of probabilities (and sorts them)
	- Generates a probability roll and selects the drop region based on the probabilities given
	- Flips a coin to choose which side of the beacon the crate will drop on
	- Finds the appropriate y-coordinate below the crate so it doesn't sink into the world
*/
function calculateArea(center : Vector3, probability : List.<float>) : Vector3 {	
	probability.Sort();
	
	var roll : float = random.value;
	var tCompare : float = 0;
	var index : int = 0;
	
	for(var i in probability) {
		if(i >= roll) {
			tCompare = i;
			index = probability.IndexOf(i);
			break;
		}
	}
	
	if(tCompare == 0) {
		tCompare = probability[probability.Count - 1];
		index = probability.Count - 1;
	}
	
	var position : Vector3;
	
	if(Random.value < 0.5) {
		position = Vector3((tCompare * -5) + center.x, center.y, (tCompare * -5) + center.z);
	}
	else {
		position = Vector3((tCompare * 5) + center.x, center.y, (tCompare * -5) + center.z);
	}
	
	position.y = findAt(position).y;
	
	return position;
}

/*
	Find Y-Coordinate:
	- Shoots a ray from the air into the world where the crate will drop
	- Finds the first collision point and then updates the vector position
*/
function findAt(position : Vector3) : Vector3 {
	position.y += 1;
	
	var hit : RaycastHit;
	
	if(Physics.Raycast(position, Vector3.down, hit)) {
		return Vector3(hit.point.x, hit.point.y, hit.point.z);
	}
	else {
		return Vector3.zero;
	}
}

/*
	Draw Mouse Laser:
	- Shoots a ray from the hand position to the forward direction
	- Sets the appropriate positions of the LineRenderer to draw the correct laser
*/
function drawLineRenderer() {
	//var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var ray : Ray = new Ray(hand.transform.localPosition, hand.transform.forward);
	var target : RaycastHit;

	// if(Physics.Raycast(ray, target, Mathf.Infinity)) {
        mouseR.enabled = true;
		mouseR.SetPosition(0, hand.transform.localPosition);
		mouseR.SetPosition(1, hand.transform.GetChild(0).transform.localPosition);
	// }
}

/*
	Offset for Time.time:
	- Function that is used to offset Time.time
	- Used for the delta when dropping the crate
*/
function resetTimer() {
	timerOffset = Time.time;
}

