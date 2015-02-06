#pragma strict

import UnityEngine.UI;

/*
	The respectve Mathf SmoothStep and Lerp minimum and maximum values used for
	dropping the crate
*/
var sMin = -3;
var sMax = 3;
var lMin = 31;
var lMax = -6;

/*
	Strings (hopefully float values) that will be grabbed from the three TextFields.
	These will be used for the coordinates of the crate drop
*/
var xInput : String; 
var yInput : String;
var zInput : String;

/*
	Boolean values to indicate whether one, the crate will land on the beacon, two,
	toggle the UI for coordinate and crate drop input, or three,
	if all three of the coordinate input values are floats
*/
var rToggle = false;
var fToggle = false;
var preCheck = false;

/*
	Crate and Beacon object used to one, manipulate the crate's position 
	(using the SmoothStep and Lerp functions), and two, 
	validate that the coordinates confirmed using the mouse are correct
*/
var crate : GameObject;
var beacon : GameObject;

/*
	The only initial setup right now is to attach the actual crate and beacon to an object
*/
function Start () {
	crate = GameObject.Find("CrateD");
	beacon = GameObject.Find("BeaconL");
}

/*
	Check to see if either the toggle for accurate crate drop success is on, or
	if the toggle for the UI coordinate-input system is on
*/
function Update () {
	if(Input.GetKeyDown (KeyCode.F1)) {
		fToggle = fToggle ? false : true;
	}
	if(Input.GetKeyDown (KeyCode.F3)) { 
		rToggle = rToggle ? false : true;
	}
	
	//drawMouseRay();
}

/*
	As long as the crate is found, this function will either
	smoothly drop the crate down to its correct position on the beacon, or,
	smoothly drop the crate down to an incorrect position outside the beacon
*/
function ReleaseCrate (toggle : boolean, x : float, y : float, z : float) {
	if(crate != null) {
		crate.SetActive(true);
		
		//Personal Note: Possibly use Translate function instead of setting position
		if(toggle) {
			crate.transform.position = Vector3(Mathf.SmoothStep(sMin, sMax, 5), Mathf.Lerp(lMin, lMax, Time.deltaTime), 
									           Mathf.SmoothStep(sMin, sMax, 5));
		}
		else {
			crate.transform.position = Vector3(Mathf.SmoothStep(sMin + Random.Range(5, 10), sMax + 10, 5), Mathf.Lerp(lMin, lMax, Time.deltaTime), 
									           Mathf.SmoothStep(sMin + Random.Range(5, 10), sMax + 10, 5));
		}
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

		if(GUI.Button (Rect (Screen.width - 300, 123, 80, 33), "Drop Crate")) { 
			if(parseFloat(xInput) && parseFloat(yInput) && parseFloat(zInput)) {
				ReleaseCrate(rToggle, parseFloat(xInput), parseFloat(yInput), parseFloat(zInput));
			}
		}
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
	
	if(Physics.Raycast(ray, target, 100)) {
		Debug.DrawLine(ray.origin, target.point, Color.red);
		
		if(target.transform.CompareTag("dirt")) {
			intersect = target.transform.position;
			if(Mathf.Abs(intersect[0] - beacon.transform.position.x) < 3 && 
				Mathf.Abs(intersect[2] - beacon.transform.position.z) < 3) {
			   		preCheck = true;
			   }
		}
	}
	
	//Personal Note: Might cause conflict right now, since preCheck is being changed in different
	//places, but later on will most likely only be confirmed through CAVE trigger, so no need to change
	if(preCheck) {
		ReleaseCrate(rToggle, intersect[0], intersect[1], intersect[2]);
	}
}