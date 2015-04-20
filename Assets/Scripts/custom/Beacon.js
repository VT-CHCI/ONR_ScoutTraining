#pragma strict

var debugger : Logger;

/*
	Start:
	- Not needed at the moment
*/
function Start () {
	debugger = gameObject.Find("CAVE Mono").GetComponent(Logger);
}

/*
	Change Beacon Color:
	- Takes a newColor and then changes the beacon and LineRenderer colors
*/
@RPC
function setColorandTag(newTag : String, newColor : String) {
	var colorObject = ParseColor(newColor);
	gameObject.GetComponent(Light).color = colorObject;
	gameObject.GetComponent(LineRenderer).SetColors(colorObject, colorObject);
	gameObject.tag = newTag;
	debugger.setText("Color: " + newColor);
}

/*
	Parse Color:
	- Takes a string and converts it to a color 
	- Format is "1.0, 1.0, .35, 1.0" - spaces are important
*/
function ParseColor (col : String) : Color {
	var strings = col.Split(", "[0] );
	var output : Color;

	for (var i = 0; i < 4; i++) {
		output[i] = System.Single.Parse(strings[i]);
	}

	return output;
}