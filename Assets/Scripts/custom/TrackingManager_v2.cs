using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class CompoundControls : MonoBehaviour {     
	private static float f;
	private static string s;
	private static string sliderString = "0";

	public static float LabelSlider (Rect screenRect, float sliderValue, float sliderMaxValue, string labelText) {
		GUI.Label (screenRect, labelText + ": " + sliderValue.ToString("0") + "ms");

		// <- Moves the Slider under the label
		screenRect.y += screenRect.height;
		f = GUI.HorizontalSlider (screenRect, sliderValue, 0.0f, sliderMaxValue);

		if (f != sliderValue) {
			sliderValue = f;
			sliderString = f.ToString("0");
		}

		// <- Moves the Input after the slider and makes it smaller
		screenRect.x += screenRect.width + 10;
		screenRect.y -= 4;
		screenRect.width = 40; 
		screenRect.height = 20; 
		s = GUI.TextField(screenRect, sliderString);

		if (sliderString != s) {
		  sliderString = s;
		   
		  if (float.TryParse(s, out f)) {
		    sliderString = s;
		    sliderValue = f;
		  }
		}

		return sliderValue;
	}
	
}


public class TrackingManager_v2 : MonoBehaviour {

	private Logger logger;
	private GameObject cave;

	private Vector3 latency;

	public GameObject head;
	public GameObject wand;
	public GameObject ARcontainer;



	public Vector3 caveCenterOffset;
	public float trackingScalingFactor;
	public float turnSensitivity;


	// Use this for initialization
	void Start () {
		cave = GameObject.Find("CAVE Mono");

		logger = (Logger) gameObject.GetComponent("Logger");
		logger.setText("Attempting to load trackers");
	}

	void OnGUI() {
		latency = latencySlider (new Rect (10,10,200,30), latency);
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	//Creates latency sliders
	Vector3 latencySlider (Rect screenRect, Vector3 latency) {
		latency.x = CompoundControls.LabelSlider (screenRect, latency.x, 2000.0f, "Head Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.y = CompoundControls.LabelSlider (screenRect, latency.y, 2000.0f, "Hand Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.z = CompoundControls.LabelSlider (screenRect, latency.z, 2000.0f, "AR Latency");
		
		return latency;
	} 
}
