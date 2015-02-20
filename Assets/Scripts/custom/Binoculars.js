#pragma strict

import System.Collections.Generic;

var topSemi : Texture2D;
var botSemi : Texture2D;
var blackScreen : Texture2D;

var cameras : Array;
var currentTexture : GUITexture;

function Start () {
	topSemi = Resources.Load("Binocular-HalfT");
	botSemi = Resources.Load("Binocular-HalfB");
	blackScreen = Resources.Load("Black-Screen");
	
	cameras = Camera.allCameras;
	
	if(topSemi != null && botSemi != null && cameras.Count != 0) {
		Debug.Log(true);
	}
	else {
		Debug.Log(false);
	}
	
	for(var cam in cameras) {
		switch(cam.ToString()) {
			case "Camera.FrontTop (UnityEngine.Camera)":
				currentTexture = (cam as Camera).guiTexture;
				currentTexture.texture = topSemi;
				Debug.Log("Reached!");
				break;
			case "Camera.FrontBottom (UnityEngine.Camera)":
				currentTexture = (cam as Camera).guiTexture;
				currentTexture.texture = botSemi;
				break;
			default:
				currentTexture = (cam as Camera).guiTexture;
				
				if(currentTexture == null) {
					break;
				}
				
				currentTexture.texture = blackScreen;
		}
		
		if((cam as Camera).guiTexture == topSemi) {
			Debug.Log("Texture Set!");
		}
	}
}

function Update () {

}