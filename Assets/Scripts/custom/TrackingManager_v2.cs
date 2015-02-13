using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class TrackingManager_v2 : MonoBehaviour {
	private GameObject cave;

	public float latency = 0.0F;
	
	public GameObject head;
	public GameObject wand;

	public Vector3 caveCenterOffset;
	public float trackerScalingFactor;
	public float turnSensitivity;
	
	private bool removeMouseLook = false;
	private bool removeFPSInputController = false;


	// Use this for initialization
	void Start () {
		cave = GameObject.Find("CAVE Mono");
	}

	void OnGUI() {
		GUI.Label(new Rect(10, 10, 100, 50), "Latency " + latency.ToString("0"));
		latency = GUI.HorizontalSlider(new Rect(25, 25, 100, 30), latency, 0.0F, 500.0F);
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
