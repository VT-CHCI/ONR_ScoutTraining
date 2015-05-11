/*
	Old script, not used
*/

#pragma strict

public var mask : Texture;

public var topMask : Texture;
public var bottomMask : Texture;
public var blankMask : Texture;

private var maskEnabled : boolean;

function OnEnable() {
    WandEventManager.OnButton1 += enableMask;
}

function Start () {
	maskEnabled = false;
}

function Update () {
//	if (maskEnabled || Input.GetKeyUp(KeyCode.Z)) {
//		//mask.active = true;
//
//		for (var camera : Camera in Camera.allCameras) {
//			if (camera.enabled) {
//				mask = camera.guiTexture;
//				mask.active = true;
//				
//				if (camera.name.Contains("FrontTop")) {
//					mask.texture = topMask;
//				} else if (camera.name.Contains("FrontBottom")) {
//					mask.texture = bottomMask;
//				} else if (camera.name.Contains("ServerView")) {
//					mask.active = false;
//				} else if (camera.name.Contains("AR")) {
//					mask.active = false;
//				} else {
//					mask.texture = blankMask;
//				}
//			}
//		}
//	} else {
//		mask.active = false;
//	}
}

function enableMask() {
	this.gameObject.GetComponent(NetworkView).RPC("toggleMask", RPCMode.AllBuffered);
}

@RPC
function toggleMask() {
	maskEnabled = !maskEnabled;
}

function OnGUI() {

		GUI.DrawTexture(Rect(0, -300, Screen.width, Screen.height), topMask, ScaleMode.ScaleToFit, true, 10.0f);

}


//function maskCameras() {
//	maskEnabled = !maskEnabled;
//	
//	if (maskEnabled) {
//		mask.active = true;
//
//		for (var camera : Camera in Camera.allCameras) {
//			if (camera.enabled) {
//				if (camera.name.Contains("FrontTop")) {
//					mask.texture = topMask;
//				} else if (camera.name.Contains("FrontBottom")) {
//					mask.texture = bottomMask;
//				} else if (camera.name.Contains("ServerView")) {
//					mask.active = false;
//				} else if (camera.name.Contains("AR")) {
//					mask.active = false;
//				} else {
//					mask.texture = blankMask;
//				}
//			}
//		}
//	} else {
//		mask.active = false;
//	}
//}