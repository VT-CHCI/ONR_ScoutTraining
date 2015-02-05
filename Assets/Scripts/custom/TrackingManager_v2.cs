using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class CompoundControls : MonoBehaviour {     
	private float f;
	private string s;

	public static float LabelSlider (Rect screenRect, float sliderValue, string sliderString, float sliderMaxValue, string labelText) {
		GUI.Label (screenRect, labelText + " " + sliderValue.ToString("0") + "ms");

		screenRect.x += screenRect.width; 
		s = GUI.TextField(screenRect, sliderString);



		// <- Push the Slider to the end of the Label
		screenRect.x -= screenRect.width;
		screenRect.y += screenRect.height;
		f = GUI.HorizontalSlider (screenRect, sliderValue, 0.0f, sliderMaxValue);

		if (f != sliderValue) {
			sliderValue = f;
			sliderString = f.ToString("0");
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
//		GUI.Label(new Rect(10, 10, 100, 50), "Head Latency " + latency.x.ToString("0") + " (ms)");
//		GUI.Label(new Rect(10, 10, 100, 50), "Hand Latency " + latency.y.ToString("0") + " (ms)");
//		GUI.Label(new Rect(10, 10, 100, 50), "AR Latency " + latency.z.ToString("0") + " (ms)");
//
//		latency.x = GUI.HorizontalSlider(new Rect(25, 25, 100, 30), latency.x, 0.0F, 2000.0F);
//		latency.y = GUI.HorizontalSlider(new Rect(25, 25, 100, 30), latency.y, 0.0F, 2000.0F);
//		latency.z = GUI.HorizontalSlider(new Rect(25, 25, 100, 30), latency.z, 0.0F, 2000.0F);

		latency = latencySlider (new Rect (10,10,200,30), latency);
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	Vector3 latencySlider (Rect screenRect, Vector3 latency) {
		latency.x = CompoundControls.LabelSlider (screenRect, latency.x, 2000.0f, "Head Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 30; 
		latency.y = CompoundControls.LabelSlider (screenRect, latency.y, 2000.0f, "Hand Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 30; 
		latency.z = CompoundControls.LabelSlider (screenRect, latency.z, 2000.0f, "AR Latency");
		
		return latency;
	} 
}
