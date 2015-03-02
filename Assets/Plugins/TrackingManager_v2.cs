using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class SliderAndTextControl 
{     
	private float f;
	private string s;

	public string sliderString;

	public SliderAndTextControl () {
		this.sliderString = "0";
	}

	public SliderAndTextControl (string sSlider) {
		this.sliderString = sSlider;
	}

	public float CreateControl (Rect screenRect, float sliderValue, float sliderMaxValue, string labelText, string units) 
	{
		GUI.Label (screenRect, labelText + ": " + sliderValue.ToString("0.0") + units);

		// <- Moves the Slider under the label
		screenRect.y += screenRect.height;
		f = GUI.HorizontalSlider (screenRect, sliderValue, 0.0f, sliderMaxValue);

		if (f != sliderValue) 
		{
			sliderValue = f;
			sliderString = f.ToString("0.0");
		}

		// <- Moves the Input after the slider and makes it smaller
		screenRect.x += screenRect.width + 10;
		screenRect.y -= 4;
		screenRect.width = 40; 
		screenRect.height = 20; 
		s = GUI.TextField(screenRect, sliderString);

		if (sliderString != s) 
		{
		 	sliderString = s;
		   
		  	if (float.TryParse(s, out f)) 
		  	{
		   		sliderString = s;
		    	sliderValue = f;
		  	}
		}

		return sliderValue;
	}
}

public class Vector3TextControl 
{     
	private int w;
	private float f;
	private Rect screenRect2;

	public string x, y, z;

	public Vector3TextControl () 
	{
		this.x = "0";
		this.y = "0";
		this.z = "0";
	}

	public Vector3TextControl (string x, string y, string z) 
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public Vector3 CreateControl (Rect screenRect, Vector3 values, string labelText) 
	{
		GUI.Label (screenRect, labelText);
		screenRect2 = screenRect;

		// <- Moves the text boxes under the label
		screenRect.y += screenRect.height;
		screenRect2.y += screenRect.height;
		w = (int)(screenRect.width-20)/3;

		screenRect.x += 5;
		screenRect.width = 15;

		screenRect2.x = screenRect.x + screenRect.width + 6;
		screenRect2.width = w - screenRect.width - 20;
		screenRect2.height = 20;

		GUI.Label (screenRect, "x:");
		x = GUI.TextField(screenRect2, x);

		screenRect.x += w + 5;
		screenRect2.x = screenRect.x + screenRect.width + 6;

		GUI.Label (screenRect, "y:");
		y = GUI.TextField(screenRect2, y);

		screenRect.x += w + 5;
		screenRect2.x = screenRect.x + screenRect.width + 6;

		GUI.Label (screenRect, "z:");
		z = GUI.TextField(screenRect2, z);

		if (float.TryParse(x, out f)) 
	  	{
	    	values.x = f;
	  	}

		if (float.TryParse(y, out f)) 
	  	{
	    	values.y = f;
	  	}

		if (float.TryParse(z, out f)) 
	  	{
	    	values.z = f;
	  	}

		return values;
	}
}


public class TrackingManager_v2 : MonoBehaviour 
{
	[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
	private struct GenericTracker
	{
		// float[6]
		[MarshalAsAttribute(UnmanagedType.ByValArray, SizeConst = 6)]
		public float[] data;
	}

	[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
	private struct WandTracker
	{
		// float[6]
		[MarshalAsAttribute(UnmanagedType.ByValArray, SizeConst = 6)]
		public float[] data;

		// float[2]
		[MarshalAsAttribute(UnmanagedType.ByValArray, SizeConst = 2)]
		public float[] joystick;

		/// unsigned char
		public byte buttons;
	}

	[StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
	private struct SensorData
	{
		public long timestamp; 
		public GenericTracker head;
		public WandTracker wand;

		// generics[1]
		[MarshalAs(UnmanagedType.ByValArray, ArraySubType = UnmanagedType.Struct, SizeConst = 1)]
		public GenericTracker[] generics;
	}

	[DllImport ("dtkPlugin")]
	private static extern void init(bool includeHand);

	[DllImport ("dtkPlugin")]
	private static extern void getData(long ms, IntPtr pSensorData);

	private long now;
	private IntPtr pData;
	private Matrix4x4 rotMatrix;
	private Matrix4x4 flipMatrix;

	private SensorData trackingDataNow;
	private SensorData trackingDataRealWorld;
	private SensorData trackingDataCam;
	private SensorData trackingDataAR;

	private Vector3 latency;
	private SliderAndTextControl headSlider;
	private SliderAndTextControl handSlider;
	private SliderAndTextControl ARSlider;

	private Vector3 caveCenterOffset;
	private Vector3TextControl caveOffsetControls;

	private float trackingScalingFactor;
	private SliderAndTextControl trackingScalingSlider;

	private float turnSensitivity;
	private SliderAndTextControl turnSensitivitySlider;

	private byte wandButtons;

	private Logger logger;
	private GameObject cave;
	private GameObject tempNow;
	private GameObject tempHead;
	private GameObject ARMaster;

	public GameObject head;
	public GameObject wand;
	public GameObject ARDisplay;
	public GameObject ARContainer;



	public delegate void ClickAction();
    public static event ClickAction OnClicked;


	// Use this for initialization
	void Start () 
	{
		cave = GameObject.Find("CAVE Mono");

		logger = (Logger) gameObject.GetComponent("Logger");
		logger.setText("Attempting to load tracker plugin");

		//Our plugin only exists for a linux machine
		if (Application.platform == RuntimePlatform.LinuxPlayer)
		{
			init(false);
			pData = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SensorData)));
		
			logger.setText("Tracker plugin initialized");
		}

		headSlider = new SliderAndTextControl();
		handSlider = new SliderAndTextControl();
		ARSlider = new SliderAndTextControl();

		//The cave origin is x = 0, y = 1.5m, z = 0
		caveCenterOffset.y = 1.5f;
		caveOffsetControls = new Vector3TextControl("0", "1.5", "0");

		//World scale is in meters
		trackingScalingFactor = 1.6f;
		trackingScalingSlider = new SliderAndTextControl("1.6");
		
		turnSensitivitySlider = new SliderAndTextControl();

		//Conversion Matrix for tracker Z-up configuration to Unity Y-up
		rotMatrix = new Matrix4x4();
		rotMatrix.SetRow(0, new Vector4(1, 0,  0, 0));
	    rotMatrix.SetRow(1, new Vector4(0, 0, -1, 0));
	    rotMatrix.SetRow(2, new Vector4(0, 1,  0, 0));
	    rotMatrix.SetRow(3, new Vector4(0, 0,  0, 1));

	    flipMatrix = new Matrix4x4();
		flipMatrix.SetRow(0, new Vector4(1, 0,  0, 0));
	    flipMatrix.SetRow(1, new Vector4(0, 1,  0, 0));
	    flipMatrix.SetRow(2, new Vector4(0, 0, -1, 0));
	    flipMatrix.SetRow(3, new Vector4(0, 0,  0, 1));

	    //Master position of all AR objects in the real world
	    ARMaster = (GameObject) Instantiate(ARContainer);
	    ARMaster.renderer.material = new Material (Shader.Find("Transparent/Diffuse"));
	    ARMaster.renderer.material.mainTexture = null;
		ARMaster.renderer.material.color = new Color(0.0F, 1.0F, 0.0F, 0.5F);

	    //Head for calculating AR transforms
	    tempNow = new GameObject("Now");
	    tempNow.transform.SetParent(cave.transform, true);

	    tempHead = new GameObject("Temp Head");
	    tempHead.transform.SetParent(cave.transform, true);
	}

	void OnGUI() 
	{
	 	GUI.BeginGroup(new Rect(10, 10, 270, 190));
			GUI.Box(new Rect(0, 0, 270, 190), "Latency Controls");
			latency = latencySlider (new Rect (10,30,200,30), latency);
		GUI.EndGroup();

		GUI.BeginGroup(new Rect(10, Screen.height - 250, 270, 240));
			GUI.Box(new Rect(0, 0, 270, 240), "CAVE Calibration");
			caveCenterOffset = caveOffsetControls.CreateControl (new Rect (10,30,270,30), caveCenterOffset, "CAVE Origin Offset");
			trackingScalingFactor = trackingScalingSlider.CreateControl (new Rect (10,90,200,30), trackingScalingFactor, 5.0f, "Tracker Scaling", "");
			turnSensitivity = turnSensitivitySlider.CreateControl (new Rect (10,140,200,30), turnSensitivity, 10.0f, "Turn Sensitivity", "");
			if (GUI.Button (new Rect (10,200,250,30), "Get Tracker Snapshot")) {
				string headTransform = "head: " + transformToString(head.transform);
				string wandTransform = "wand: " + transformToString(wand.transform);
				string ARContainerTransform = "ar: " + transformToString(ARContainer.transform);
				
				logger.setText("-----------");
				logger.setText(wandTransform);
				logger.setText(headTransform);
				logger.setText(ARContainerTransform);
				logger.setText(wandButtons.ToString("D4"));
				logger.setText(wandButtons.ToString("000000"));

				if(OnClicked != null)
                	OnClicked();
			}
		GUI.EndGroup();
	}
	
	// Update is called once per frame
	void Update () 
	{
		TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
		now = (long)t.TotalMilliseconds;

		if (Application.platform == RuntimePlatform.LinuxPlayer)
		{
			try
		    {	
		    	getData((now), pData);
		      	trackingDataNow = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));

		      	ZupToYup(tempNow, trackingDataNow.head.data, true);
		      	wandButtons = trackingDataNow.wand.buttons;

		    	getData((now - (long)latency.x), pData);
		      	trackingDataRealWorld = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));
		      
		      	ZupToYup(head, trackingDataRealWorld.head.data, true);
		      	ZupToYup(wand, trackingDataRealWorld.wand.data);

		      	getData((now - (long)latency.y), pData);
		      	trackingDataCam = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));
		      
		      	getData((now - (long)latency.z), pData);
		      	trackingDataAR = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));

		      	ZupToYup(tempHead, trackingDataAR.head.data, true);
		      	pastARTransform(ARContainer, tempNow, tempHead);
		    }
		    catch
		    {
		       logger.setText("Error with getting tracker data!");
		    }
	  	}
	}

	void pastARTransform (GameObject arObj, GameObject parentNow, GameObject parentThen) {
		GameObject tempObj = (GameObject) Instantiate(ARMaster);
		tempObj.transform.SetParent(parentNow.transform, true);

		arObj.transform.SetParent(parentThen.transform, true);
		arObj.transform.localPosition = tempObj.transform.localPosition;
		arObj.transform.localRotation = tempObj.transform.localRotation;
		arObj.transform.SetParent(null, true);

		Destroy(tempObj);
	}

	void ZupToYup (GameObject obj, float[] transforms, bool posOnly = false, bool applyPosOffsets = true)
	{
		Vector3 t = new Vector3(transforms[0], transforms[1], -transforms[2]);
		Quaternion r = Quaternion.Euler(transforms[3], transforms[4], transforms[5]);
		Vector3 s = new Vector3(1, 1, 1);

		Matrix4x4 m = Matrix4x4.TRS(t, r, s);
		m = rotMatrix*m*flipMatrix;

		// Extract new local position
		if (applyPosOffsets)
		{
			obj.transform.localPosition = (Vector3)m.GetColumn(3)*trackingScalingFactor + caveCenterOffset;
		}
		else
		{
			obj.transform.localPosition = (Vector3)m.GetColumn(3)*trackingScalingFactor;
		}

		// Extract new local rotation
		if (posOnly)
		{
			obj.transform.eulerAngles = Vector3.zero;
		}
		else 
		{
			obj.transform.localRotation = Quaternion.LookRotation(
			  	m.GetColumn(2),
			  	m.GetColumn(1)
			);
		}

		// Extract new local scale
		obj.transform.localScale = new Vector3 (
			m.GetColumn(0).magnitude,
			m.GetColumn(1).magnitude,
			m.GetColumn(2).magnitude
		);
	} 

	//Creates latency sliders
	Vector3 latencySlider (Rect screenRect, Vector3 latency) 
	{
		latency.x = headSlider.CreateControl (screenRect, latency.x, 2000.0f, "Real World Latency", " ms");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.y = handSlider.CreateControl (screenRect, latency.y, 2000.0f, "Hand Cam Latency", " ms");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.z = ARSlider.CreateControl (screenRect, latency.z, 2000.0f, "AR Obj Latency", " ms");
		
		return latency;
	} 

	string transformToString (Transform component){
		return component.transform.position.x.ToString("0.0") + ", " + component.transform.position.y.ToString("0.0")
			 + ", " + component.transform.position.z.ToString("0.0") + "| " + component.transform.localEulerAngles.x.ToString("0.0")
			 + ", " + component.transform.localEulerAngles.y.ToString("0.0") + ", " + component.transform.localEulerAngles.z.ToString("0.0");
	}
}
