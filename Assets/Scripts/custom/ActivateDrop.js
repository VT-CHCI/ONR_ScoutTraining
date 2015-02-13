#pragma strict

import UnityEngine.UI;
import System.Collections.Generic;
/*
	Time variable to calculate the speed of descent for the crate
*/
var startTime : float;

/*
	Strings (hopefully float values) that will be grabbed from the three TextFields.
	These will be used for the coordinates of the crate drop
*/
var xInput : String; 
var yInput : String;
var zInput : String;
var rInput : String;
var inputC : Vector3;

/*
	Boolean values to indicate whether one, the crate will land on the beacon, two,
	toggle the UI for coordinate and crate drop input, three,
	if all three of the coordinate input values are floats, or four,
	if "Drop Crate" was pressed
*/
var rToggle = true;
var fToggle = false;
var preCheck = false;
var buttonCheck = false;
var clickCheck = false;

/*
	Crate and Beacon object used to one, manipulate the crate's position 
	(using the SmoothStep and Lerp functions), and two, 
	validate that the coordinates confirmed using the mouse are correct
*/
var crate : GameObject;
var beacon : GameObject;
var mouseR : LineRenderer;

/*
	Variable used to manage SmoothStep and Lerp functions movement speed
*/
var delta = 0.0;

/*
	Random generator for failed crate drop inside beacon area
*/
var random : Random;

/*
	The only initial setup right now is to attach the actual crate and beacon to an object
*/
function Start () {
	crate = GameObject.Find("CrateD");
	crate.renderer.enabled = false;
	beacon = GameObject.Find("BeaconL");
	mouseR = GameObject.Find("MouseRay").GetComponent(LineRenderer);
	
	startTime = Time.time;
	
	random = new Random();
}

/*
	Check to see if either the toggle for accurate crate drop success is on, or
	if the toggle for the UI coordinate-input system is on
*/
function Update () {
	if(Input.GetKeyDown (KeyCode.F1)) {
		fToggle = fToggle ? false : true;
	}
	
	else if(Input.GetKeyDown (KeyCode.F2)) { 
		rToggle = rToggle ? false : true;
	}
	
	else if(Input.GetKeyDown (KeyCode.F3)) {
		//Possibly add in functionality to reset crate?
	}
	
	else if(!clickCheck) {
		drawMouseRay();
		
		if(!rToggle) {
			calculateArea(inputC, new List.<float>([.68, .95, .997]));
		}
	}
	
	else if(buttonCheck || clickCheck) {
		ReleaseCrate(rToggle, inputC, 10);
	}
}

/*
	Checks to see if three float values were input; these will then be used
	for coordinates for the crate drop once the respective button is clicked
*/
function OnGUI() {
	if(fToggle) {
		xInput = GUI.TextField (Rect (Screen.width - 160, 30, 160, 30), xInput);
		yInput = GUI.TextField (Rect (Screen.width - 160, 60, 160, 30), yInput);
		zInput = GUI.TextField (Rect (Screen.width - 160, 90, 160, 30), zInput);
		rInput = GUI.TextField (Rect (Screen.width - 160, Screen.height + 30, 160, 30), rInput);

		if(GUI.Button (Rect (Screen.width - 160, 123, 80, 33), "Drop Crate")) { 
			if(float.TryParse(xInput, inputC.x) && float.TryParse(yInput, inputC.y) && 
				float.TryParse(zInput, inputC.z)) {
				buttonCheck = true;
			}
		}
	}
}

/*
	As long as the crate is found, this function will either
	smoothly drop the crate down to its correct position on the beacon, or,
	smoothly drop the crate down to an incorrect position outside the beacon
*/
function ReleaseCrate (toggle : boolean, targetP : Vector3 , t : float) {
	if(crate != null) {
		crate.transform.position = Vector3(targetP.x - 30, targetP.y + 100, targetP.z);
		crate.renderer.enabled = true;
		delta = ((Time.time - startTime) / t);
		
		crate.transform.position = Vector3.Lerp(crate.transform.position, targetP, delta);
	}
}

/*
	Using the mouse, a ray will be drawn to show the user where they are pointing in the world.
	They will use this ray to confirm the location for the crate drop.
*/
function drawMouseRay() {
	//Personal Note: There might be no main camera, might be tagged as something else
	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
	var target : RaycastHit;
	var intersect : Vector3;
	
	if(Physics.Raycast(ray, target, Mathf.Infinity)) {
		mouseR.SetPosition(1, target.point);
		
		if(Input.GetMouseButtonDown(0)) {
			intersect = Vector3(target.point.x, target.point.y, target.point.z);
			Debug.Log(intersect);
			inputC = intersect;
			inputC.y = inputC.y + .5;
			preCheck = true;
			clickCheck = true;
		}
	}
}

/*
	This function takes a Vector3 position and a List of probabilities, and then
	generates a random float from 0.0 to 1.0 to decide in what vicinity the crate
	will drop
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



