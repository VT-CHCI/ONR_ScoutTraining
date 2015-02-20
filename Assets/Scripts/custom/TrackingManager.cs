using UnityEngine;
using System.Collections;
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class TrackingManager : MonoBehaviour {
//Lets make our calls from the Plugin	
	
	const int BUTTON = 0;
	const int NOT_BUTTON = 1;
	
	[DllImport ("dtkPlugin")]
	private static extern IntPtr ReadDevice_Create(string deviceName, int size, int type);
	
	[DllImport ("dtkPlugin")]
	private static extern bool ReadDevice_valid(IntPtr pFoo);
	
	[DllImport ("dtkPlugin")]
	//private static extern IntPtr ReadDevice_get6DOF(IntPtr pFoo);
	private static extern int ReadDevice_get6DOF(IntPtr pFoo, [In, Out]IntPtr buffer, [In] int length, [Out] out int written);
	
	[DllImport ("dtkPlugin")]
	private static extern float[] ReadDevice_getPosition(IntPtr pFoo, int size);
	
	[DllImport ("dtkPlugin")]
	private static extern char ReadDevice_getButtons(IntPtr pFoo);
	
	[DllImport ("dtkPlugin")]
	private static extern void ReadDevice_Delete(IntPtr pFoo);
	
	private IntPtr headTracker;
	private float[] headTrackingData;
	
	private IntPtr wandTracker;
	private float[] wandTrackingData;
	public float latency = 0.0F;
	List<Vector3> wandModPos = new List<Vector3>();
	List<Vector3> wandModRot = new List<Vector3>();
	
	private IntPtr joystickTracker;
	private float[] joystickTrackerData;
	
	//private Debugger debugger;
	
	public GameObject cave;
	public Vector3 caveCenterOffset;
	
	public GameObject head;
	public GameObject wand;
	
	public float trackerScalingFactor;
	public float turnSensitivity;
	
	private bool removeMouseLook = false;
	private bool removeFPSInputController = false;
	
	private CharacterMotor motor;
	void Start () {
		//debugger = (Debugger) gameObject.GetComponent("Debugger");
		//debugger.setText("Attempting to load trackers");
		
		motor = (CharacterMotor) gameObject.GetComponent(typeof(CharacterMotor));
		
		headTracker = ReadDevice_Create ("head", 6, NOT_BUTTON);
		
		if (ReadDevice_valid(headTracker)) {
			//debugger.setText ("Connected to head");
			removeMouseLook = true;
		} else {
			//debugger.setText ("Connecting to head failed");
		}
		
		wandTracker = ReadDevice_Create ("wand", 6, NOT_BUTTON);
		
		if (ReadDevice_valid(wandTracker)) {
			//debugger.setText ("Connected to wand");
		} else {
			//debugger.setText ("Connecting to wand failed");
		}
		
		joystickTracker = ReadDevice_Create("joystick", 2, NOT_BUTTON);
		
		if (ReadDevice_valid(joystickTracker)) {
			//debugger.setText ("Connected to joystick");
			removeFPSInputController = true;
		} else {
			//debugger.setText ("Connecting to joystick failed");
		}
	}

	void OnGUI() {
		GUI.Label(new Rect(10, 10, 100, 50), "Latency " + latency.ToString("0"));
		latency = GUI.HorizontalSlider(new Rect(25, 25, 100, 30), latency, 0.0F, 500.0F);
	}
	
	void Update () {
		if (removeMouseLook && gameObject.GetComponent("MouseLook")) 
			Destroy(gameObject.GetComponent("MouseLook"));
		
		if (removeFPSInputController && gameObject.GetComponent("FPSInputController")) 
			Destroy(gameObject.GetComponent("FPSInputController"));
		
		if (ReadDevice_valid(headTracker)) {
			headTrackingData = RetrieveFloats(headTracker);
			
			//head.transform.position = new Vector3(cave.transform.position.x + caveCenterOffset.x + headTrackingData[0]*trackerScalingFactor, cave.transform.position.y + caveCenterOffset.y + headTrackingData[2]*trackerScalingFactor, cave.transform.position.z + caveCenterOffset.z + headTrackingData[1]*trackerScalingFactor);
			//headOrientation.transform.localEulerAngles = new Vector3(-headTrackingData[4], -headTrackingData[3], -headTrackingData[5]);
			
			head.transform.localPosition = new Vector3(caveCenterOffset.x + headTrackingData[0]*trackerScalingFactor, caveCenterOffset.y + headTrackingData[2]*trackerScalingFactor, caveCenterOffset.z + headTrackingData[1]*trackerScalingFactor);
			
			Debug.Log("resulting head position: ");
			Debug.Log(head.transform.position);
		}
		
		if (ReadDevice_valid(wandTracker)) {
			wandTrackingData = RetrieveFloats(wandTracker);
			
			//wand.transform.position = new Vector3(cave.transform.position.x + caveCenterOffset.x + wandTrackingData[0]*trackerScalingFactor, cave.transform.position.y + caveCenterOffset.y + wandTrackingData[2]*trackerScalingFactor, cave.transform.position.z + caveCenterOffset.z + wandTrackingData[1]*trackerScalingFactor);

//			wand.transform.localPosition = new Vector3(caveCenterOffset.x + wandTrackingData[0]*trackerScalingFactor, caveCenterOffset.y + wandTrackingData[2]*trackerScalingFactor, caveCenterOffset.z + wandTrackingData[1]*trackerScalingFactor);
//			wand.transform.eulerAngles = new Vector3(-wandTrackingData[4], -wandTrackingData[3], -wandTrackingData[5]);

			if (wandModPos.Count > 20) {
				wand.transform.localPosition = wandModPos[0];
				wandModPos.RemoveAt(0);
				wandModPos.Add(new Vector3(caveCenterOffset.x + wandTrackingData[0]*trackerScalingFactor, caveCenterOffset.y + wandTrackingData[2]*trackerScalingFactor, caveCenterOffset.z + wandTrackingData[1]*trackerScalingFactor));
			
				wand.transform.eulerAngles = wandModRot[0];
				wandModRot.RemoveAt(0);
				wandModRot.Add(new Vector3(-wandTrackingData[4], -wandTrackingData[3], -wandTrackingData[5]));
			}
			else {
				wandModPos.Add(new Vector3(caveCenterOffset.x + wandTrackingData[0]*trackerScalingFactor, caveCenterOffset.y + wandTrackingData[2]*trackerScalingFactor, caveCenterOffset.z + wandTrackingData[1]*trackerScalingFactor));
				wandModRot.Add(new Vector3(-wandTrackingData[4], -wandTrackingData[3], -wandTrackingData[5]));
			}
			
			Debug.Log("resulting wand position: ");
			Debug.Log(wand.transform.position);
		}
		
		if (ReadDevice_valid(joystickTracker)) {
			joystickTrackerData = RetrieveFloats(joystickTracker);
			
			Vector3 directionVector = new Vector3(0F, 0F, joystickTrackerData[1]);
	
			if (directionVector != Vector3.zero) {
				// Get the length of the directon vector and then normalize it
				// Dividing by the length is cheaper than normalizing when we already have the length anyway
				float directionLength = directionVector.magnitude;
				directionVector = directionVector / directionLength;
				
				// Make sure the length is no bigger than 1
				directionLength = Mathf.Min(1, directionLength);
				
				// Make the input vector more sensitive towards the extremes and less sensitive in the middle
				// This makes it easier to control slow speeds when using analog sticks
				directionLength = directionLength * directionLength;
				
				// Multiply the normalized direction vector by the modified length
				directionVector = directionVector * directionLength;
			}
			
			// Apply the direction to the CharacterMotor
			motor.inputMoveDirection = wand.transform.localRotation * directionVector;
			
			cave.transform.Rotate(0, joystickTrackerData[0] * turnSensitivity, 0);
		}
	}
	
	float[] RetrieveFloats(IntPtr tracker) {
		int bytesToAllocate = 0;
		
		ReadDevice_get6DOF(tracker, IntPtr.Zero, 0, out bytesToAllocate);
		
		if(bytesToAllocate == 0)
			return null;
		
		int floatCount = bytesToAllocate/ sizeof(float);
		
		float[] toReturn = new float[floatCount];
		IntPtr allocatedMemory = Marshal.AllocHGlobal(bytesToAllocate);
		
		int written = 0;
		
		if(ReadDevice_get6DOF(tracker, allocatedMemory, bytesToAllocate, out written) != -1) {
			floatCount = written/sizeof(float);
			Marshal.Copy(allocatedMemory, toReturn, 0, floatCount);
		}
		
		Marshal.FreeHGlobal(allocatedMemory);
		return toReturn;
	}
}
