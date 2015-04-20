using UnityEngine;
using System.Collections;

public class Logger : MonoBehaviour {
	private Rect scrollRect = new Rect(0, 0, 0, 3000);
	private Rect labelRect = new Rect(0, 0, 400, 3000); 
	
	private bool show = true;
	private Vector2 scrollPosition = Vector2.zero;
	
	private string text = "";
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.F2)) {
			show = !show;
		}
	}

	void OnGUI () {
		if (show) {
			scrollPosition = GUI.BeginScrollView (new Rect(Screen.width - 410, 10, 400, Screen.height - 10), scrollPosition, scrollRect);			
			GUI.Label (labelRect, text);
			GUI.EndScrollView ();
		}
	}

	public void setText(string newString) {
		text = newString + "\n" + text;
		Debug.Log(newString);
	}

}