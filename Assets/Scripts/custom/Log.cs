using UnityEngine;
using System.Collections;

public class Log : MonoBehaviour {

	private Rect windowSize = new Rect(Screen.width - 220, 10, 200, 130);
	private Rect scrollRect = new Rect(0, 0, 0, 3000);
	private Rect labelRect = new Rect(0, 0, 200, 3000); 
	
	private bool show = true;
	private Vector2 scrollPosition = Vector2.zero;
	
	public string text = "";
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.F2)) {
			show = !show;
		}
	}

	void OnGUI () {
		if (show) {
			scrollPosition = GUI.BeginScrollView (windowSize, scrollPosition, scrollRect);			
			GUI.Label (labelRect, text);
			GUI.EndScrollView ();
		}
	}

	void setText(string newString) {
		text = newText + "\n" + text;
		Debug.Log(newText);
	}

}