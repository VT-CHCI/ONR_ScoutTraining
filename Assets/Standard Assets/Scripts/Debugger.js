#pragma strict

private var windowSize : Rect = Rect (Screen.width - 220, 10, 200, 130);
private var scrollRect : Rect = Rect (0, 0, 0, 3000);
private var labelRect : Rect = Rect (0, 0, 200, 3000); 

private var show = true;

private var scrollPosition : Vector2 = Vector2.zero;

public var text = "";

function setText (newText: String) {
	text = newText + "\n" + text;
	Debug.Log(newText);
}

function OnGUI () {
	if (show) {
		scrollPosition = GUI.BeginScrollView (windowSize, scrollPosition, scrollRect);			
		GUI.Label (labelRect, text);
		GUI.EndScrollView ();
	}
}

function Update() {
    if (Input.GetKeyDown(KeyCode.F2)) {
        show = !show;
    }
}