#pragma strict

/*
	Variables:
	- Boolean to decide when to show the error message to user
	- Boolean to drop the crates in testing form
	- Crate Prefab that will be used to clone the other crates
	- Hand object that will represent the wand
	- Maximum distance to check for beacons around the wand's intersection point
*/
private var showMessage : boolean = false;
public var testingDrop : boolean = true;
public var cratePrefab : GameObject;
public var hand : GameObject;
public var distance : float;

/*
	Start:
	- Not needed at the moment
*/
function Start () {

}

/*
	Update (Every frame):
	- Checks for the wand's trigger to spawn a new crate
	- Drops all of the crates in the world when the user hits Spacebar
*/
function Update () {
	/* if(trigger detection) {
		spawnCrate();
	} */
	
	if(Input.GetKeyUp(KeyCode.Space)) {
		if(testingDrop) {
			spawnCrate(true);
		}
	}
}

/*
	Update Distance:
	- Takes a new float that represents the new maximum distance to check for beacons
*/
function updateDistance(newDistance : float) {
	distance = newDistance;
}

/*
	Spawn New Crate:
	- Shoots a ray from the wand straight into the world to find the intersection point
	- Finds the closest beacon to the intersection point and creates a new beacon
	- If no beacon is found, tell the user to re-select a location
*/
function spawnCrate() {
	var position = drawHandRay();
	var cratePosition : Vector3;
	var shortestDistance : float = Mathf.Infinity;
	
	for(beacon in GameObject.FindGameObjectsWithTag("Beacon")) {
		var newDistance = Mathf.Abs(Vector3.Distance(beacon.transform.position, position));
		
		if(newDistance <= distance) {
			if(newDistance <= shortestDistance) {
				shortestDistance = newDistance;
				cratePosition = beacon.transform.position;
			}
		}
	}
	
	if(cratePosition == null) {
		Invoke("toggleMessage", 5);
		return;
	}
	
	createCrate(cratePosition, 10, false);
}

function spawnCrate(flag : boolean) {
	if(flag) {
		var cratePosition : Vector3;
			
		for(beacon in GameObject.FindGameObjectsWithTag("Beacon")) {
			cratePosition = beacon.transform.position;
			createCrate(cratePosition, 10, false);
		}
	}
}

/*
	Inner Function for spawnCrate:
	- Instantiates a new crate from the cratePrefab given a position, certain time of descent, 
	  and whether to destroy on impact or not
	- Tags the object with "Crate" to search for it later
*/
function createCrate(position : Vector3, time : float, destroy : boolean) {
	var newCrate = Network.Instantiate(cratePrefab, position, Quaternion.identity, 2);
	newCrate.GetComponent(Crate).setPAndTAndD(position, time, destroy);
	newCrate.tag = "Crate";
}

/*
	Draw Wand Ray:
	- Shoots a ray straight into the world and finds the intersection point
	- Returns this position to spawnCrate
*/
function drawHandRay() : Vector3 {
	var ray : Ray = new Ray(hand.transform.localPosition, hand.transform.forward);
	var target : RaycastHit;
	var intersect : Vector3;
	
	if(Physics.Raycast(ray, target, Mathf.Infinity)) {		
		intersect = Vector3(target.point.x, target.point.y, target.point.z);
	}
	
	return intersect;
}

/*
	Toggle Message Boolean:
	- Changes the showMessage boolean to either true or false
*/
function toggleMessage() {
	showMessage = !showMessage;
}

/*
	On GUI Call:
	- If showMessage is true, then show the user the error message
*/
function OnGUI() {
	if(showMessage) {
		GUI.Label(new Rect(Screen.width / 2, Screen.height / 2, 200f, 200f), "Please re-select a point.");
	}
}