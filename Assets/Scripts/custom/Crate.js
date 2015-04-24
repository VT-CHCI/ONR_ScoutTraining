 #pragma strict

/*
	Variables:
	- Position Vector3 where the crate will spawn above
	- The time it will take the crate to reach its position
	- The start time of this script, used to calculate each delta change in time
	- Boolean deciding whether or not the crate will be destroyed on impact
*/
private var positionV : Vector3;
private var deltaVector : Vector3;
private var time : float;
private var startTime : float;
private var explode : boolean = false;
private var debugger : Logger;

/*
	Start:
	- Set the initial time
*/
function Start () {
	startTime = Time.time;
	
	positionV = calculateArea(new List.<float>(new List.<float>([.68, .95, .997])));
	Debug.Log(positionV.x + " " + positionV.y +  " " + positionV.z);
	
	debugger = gameObject.Find("CAVE Mono").GetComponent(Logger);
	
	deltaVector = (positionV - transform.position);
}

/*
	Update (Every frame):
	- If startDrop is true, then drop the crate
*/
function Update () {
	dropCrate();
}

/*
	Set Variables:
	- Set the position, time of descent, and explode variables
	- Used by the CSpawner when creating new crates
*/
@RPC
function setVariables(newPosition : Vector3, newTime : float, destroyImpact : boolean, newTag : String) {
	positionV = newPosition;
	time = newTime;
	explode = destroyImpact;
	gameObject.tag = newTag;
}

/*
	Drop the Crate:
	- Moves the crate to above the position where it will drop
	- Make the crate visible and start calculating the delta time values
	- Interpolate the crate between its starting position and end position
	- When the crate reaches its end position, if explode is true, then destroy the crate
*/
function dropCrate() {
	//transform.position = Vector3(positionV.x - 30, positionV.y + 200, positionV.z);
	
	var delta = ((Time.time - startTime) / time);
	
	//transform.position = Vector3.Lerp(transform.position, positionV, delta);
	
	// Using translate function
//	if(transform.position.x < positionV.x) {
//		transform.Translate(deltaVector * (Time.deltaTime / 10), Space.World);
//	}
	
	// Using Rigidbody AddForce function
//	if(Mathf.Abs(transform.position.x - positionV.x) > .1) {
//		GetComponent.<Rigidbody>().AddForce(deltaVector * (Time.deltaTime / 10));
//	}
	
	// Using AddForce based off framerate
	if(transform.position.y - positionV.y > 3) {
		GetComponent.<Rigidbody>().AddForce(deltaVector * 1);
		
		if(positionV.x < -15) {
			//debugger.setText("X: " + transform.position.x + " Y: " + transform.position.y + " Z: " + transform.position.z);
		}
	}
	
	if(Mathf.Abs(Vector3.Distance(transform.position, positionV)) <= 0.2f) {
		if(explode) {
			if(Network.isServer) {
				Destroy(this);
			}
		}
	}
}

/*
	Calcuate Probability Area:
	- Takes a list of probabilities and sudo-randomly finds the new position to drop the crate
	- Used to account for concepts such as error, wind, etc
*/
function calculateArea(probability : List.<float>) : Vector3 {
	Debug.Log(positionV.x + " " + positionV.y +  " " + positionV.z);
	probability.Sort();
	
	var roll : float = Random.value;
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
	
	var newPosition : Vector3;
	
	if(Random.value < 0.5) {
		newPosition = Vector3((tCompare * -5) + positionV.x, positionV.y, (tCompare * -5) + positionV.z);
	}
	else {
		newPosition = Vector3((tCompare * 5) + positionV.x, positionV.y, (tCompare * -5) + positionV.z);
	}
	
	newPosition.y = findAt(newPosition).y;
	
	return newPosition;
}

/*
	Find Position Below Crate:
	- Finds the first object below the crate to make sure that it will not descent through buildings or anything solid
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