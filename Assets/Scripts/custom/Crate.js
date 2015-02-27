 #pragma strict

/*
	Variables:
	- Position Vector3 where the crate will spawn above
	- The time it will take the crate to reach its position
	- The start time of this script, used to calculate each delta change in time
	- Boolean deciding whether or not the crate will be destroyed on impact
*/
private var positionV : Vector3;
private var time : float;
private var startTime : float;
private var explode : boolean = false;

/*
	Start:
	- Set the initial time
*/
function Start () {
	startTime = Time.time;
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
function setPAndTAndD(newPosition : Vector3, newTime : float, destroyImpact : boolean) {
	positionV = newPosition;
	time = newTime;
	explode = destroyImpact;
}

/*
	Drop the Crate:
	- Moves the crate to above the position where it will drop
	- Make the crate visible and start calculating the delta time values
	- Interpolate the crate between its starting position and end position
	- When the crate reaches its end position, if explode is true, then destroy the crate
*/
function dropCrate() {
	transform.position = Vector3(positionV.x - 30, positionV.y + 200, positionV.z);
	var delta = ((Time.time - startTime) / time);
	
	transform.position = Vector3.Lerp(transform.position, positionV, delta);
	
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