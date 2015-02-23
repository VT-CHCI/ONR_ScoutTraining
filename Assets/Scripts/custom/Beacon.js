#pragma strict

//public var color : Color;

function Start () {
	//gameObject.GetComponent(Light).color = color;
	//gameObject.GetComponent(LineRenderer).SetColors(color, color);
}

function setColor(newColor : Color) {
	gameObject.GetComponent(Light).color = newColor;
	gameObject.GetComponent(LineRenderer).SetColors(newColor, newColor);
}