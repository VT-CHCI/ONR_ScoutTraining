#pragma strict

public var mask : RawImage;

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
}

function enableMask() {
	maskEnabled = !maskEnabled;
	
	var parent = this.gameObject;
	

	parent.GetComponent(NetworkView).RPC("maskCameras", RPCMode.AllBuffered);
}

@RPC
function maskCameras() {
	if (maskEnabled) {
		mask.active = true;

		for (var camera : Camera in Camera.allCameras) {
			if (camera.enabled) {
				if (camera.name.Contains("FrontTop")) {
					mask.texture = topMask;
				} else if (camera.name.Contains("FrontBottom")) {
					mask.texture = bottomMask;
				} else if (camera.name.Contains("ServerView")) {
					mask.active = false;
				} else if (camera.name.Contains("AR")) {
					mask.active = false;
				} else {
					mask.texture = blankMask;
				}
			}
		}
	} else {
		mask.active = false;
	}
}