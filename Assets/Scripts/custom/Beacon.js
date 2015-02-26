#pragma strict

/*
	Start:
	- Not needed at the moment
*/
function Start () {

}

/*
	Change Beacon Color:
	- Takes a newColor and then changes the beacon and LineRenderer colors
*/
function setColor(newColor : Color) {
	gameObject.GetComponent(Light).color = newColor;
	gameObject.GetComponent(LineRenderer).SetColors(newColor, newColor);
}