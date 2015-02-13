using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;

public class SliderAndTextControl 
{     
	private float f;
	private string s;
	
	public string sliderString = "0";

	public float CreateControl (Rect screenRect, float sliderValue, float sliderMaxValue, string labelText) 
	{
		GUI.Label (screenRect, labelText + ": " + sliderValue.ToString("0.0") + "ms");

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

	public string x = "0";
	public string y = "0";
	public string z = "0";

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

	private SensorData trackingData;

	private Logger logger;
	private GameObject cave;

	private Vector3 latency;
	private SliderAndTextControl headSlider;
	private SliderAndTextControl handSlider;
	private SliderAndTextControl ARSlider;

	public GameObject head;
	public GameObject wand;
	public GameObject ARDisplay;
	public GameObject ARContainer;

	public Vector3 caveCenterOffset;
	private Vector3TextControl caveOffsetControls;

	public float trackingScalingFactor;
	private SliderAndTextControl trackingScalingSlider;

	public float turnSensitivity;
	private SliderAndTextControl turnSensitivitySlider;

	public bool notCave;


	// Use this for initialization
	void Start () 
	{
		cave = GameObject.Find("CAVE Mono");

		logger = (Logger) gameObject.GetComponent("Logger");
		logger.setText("Attempting to load trackers");

		if (!notCave)
		{
			init(false);
			pData = Marshal.AllocHGlobal(Marshal.SizeOf(typeof(SensorData)));
		
			logger.setText("Trackers initialized");
		}

		headSlider = new SliderAndTextControl();
		handSlider = new SliderAndTextControl();
		ARSlider = new SliderAndTextControl();

		caveOffsetControls = new Vector3TextControl();
		trackingScalingSlider = new SliderAndTextControl();
		turnSensitivitySlider = new SliderAndTextControl();

		trackingScalingFactor = 2.5f;
		trackingScalingSlider.sliderString = "2.5";
	}

	void OnGUI() 
	{
	 	GUI.BeginGroup(new Rect(10, 10, 270, 190));
		GUI.Box(new Rect(0, 0, 270, 190), "Latency Controls");
		latency = latencySlider (new Rect (10,30,200,30), latency);
		GUI.EndGroup();

		GUI.BeginGroup(new Rect(10, Screen.height - 210, 270, 200));
		GUI.Box(new Rect(0, 0, 270, 200), "CAVE Calibration");
		caveCenterOffset = caveOffsetControls.CreateControl (new Rect (10,30,270,30), caveCenterOffset, "CAVE Origin Offset");
		trackingScalingFactor = trackingScalingSlider.CreateControl (new Rect (10,90,200,30), trackingScalingFactor, 5.0f, "Tracker Scaling");
		turnSensitivity = turnSensitivitySlider.CreateControl (new Rect (10,140,200,30), turnSensitivity, 10.0f, "Turn Sensitivity");
		GUI.EndGroup();
	}
	
	// Update is called once per frame
	void Update () 
	{
		TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
		now = (long)t.TotalMilliseconds;

		if (!notCave)
		{
			try
	    {	
	    	getData((now - (long)latency.x), pData);
	      trackingData = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));
	      
	      head.transform.localPosition = applyPosOffsets(trackingData.head.data);
	      wand.transform.localPosition = applyPosOffsets(trackingData.wand.data);

	      getData((now - (long)latency.y), pData);
	      trackingData = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));
	      
	      getData((now - (long)latency.z), pData);
	      trackingData = (SensorData)Marshal.PtrToStructure(pData, typeof(SensorData));
	    }
	    catch
	    {
	       logger.setText("Error with getting tracker data!");
	    }
	  }
	}

	Vector3 applyPosOffsets(float[] trackerData)
	{
		return new Vector3(caveCenterOffset.x + trackerData[0]*trackingScalingFactor, caveCenterOffset.y + trackerData[1]*trackingScalingFactor, caveCenterOffset.z + trackerData[2]*trackingScalingFactor);
	}

	//Creates latency sliders
	Vector3 latencySlider (Rect screenRect, Vector3 latency) 
	{
		latency.x = headSlider.CreateControl (screenRect, latency.x, 2000.0f, "Head Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.y = handSlider.CreateControl (screenRect, latency.y, 2000.0f, "Cam Latency");
		
		// <- Move the next control down a bit to avoid overlapping
		screenRect.y += 50; 
		latency.z = ARSlider.CreateControl (screenRect, latency.z, 2000.0f, "AR Obj Latency");
		
		return latency;
	} 
}
