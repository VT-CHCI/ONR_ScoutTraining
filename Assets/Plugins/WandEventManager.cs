using UnityEngine;
using System.Collections;

public class WandEventManager : MonoBehaviour {

	private class Button
	{
		private bool lastValue;
		private int bitMask;

		public Button(int bit) {
			bitMask = bit;
			lastValue = false;
		}

		public bool buttonUp (byte byteArray) {
			bool returnVal;
			var bit = (byteArray & (1 << bitMask - 1)) != 0;

			if (bit == false && lastValue == true) {
				returnVal = true;
			} else {
				returnVal = false;
			}

			lastValue = bit;
			return returnVal;
		}
	}

	// Events that can be subscribed to
	public delegate void ButtonAction();
    public static event ButtonAction OnTrigger;
    public static event ButtonAction OnButton1;
    public static event ButtonAction OnButton2;
    public static event ButtonAction OnButton3;
    public static event ButtonAction OnButton4;
    public static event ButtonAction OnJoystickButton;

    public static Vector2 joystick;

    // Helper class for keeping track of button state
   	private Button trigger = new Button(6);
   	private Button button1 = new Button(1);
   	private Button button2 = new Button(2);
   	private Button button3 = new Button(3);
   	private Button button4 = new Button(4);
   	private Button joystickButton = new Button(5);

   	// If this script is enabled it subscribes to wand updates
    void OnEnable()
    {
        TrackingManager_v2.OnWandUpdate += wandUpdate;
    }

//    void OnGUI()
//    {
//        if(GUI.Button(new Rect(Screen.width / 2 - 50, 5, 100, 30), "Click"))
//        {
//            if(OnButton1 != null)
//                OnButton1();
//        }
//    }

    // Handles the data in a Wand event which contains joystick data and button presses
    void wandUpdate(wandEvent e)
    {
    	joystick.x = e.Joystick[0];
    	joystick.y = e.Joystick[1];

    	if (OnTrigger != null && trigger.buttonUp(e.Buttons)) {
    		OnTrigger();
    	}
    	if (OnButton1 != null && button1.buttonUp(e.Buttons)) {
    		OnButton1();
    	}
    	if (OnButton2 != null && button2.buttonUp(e.Buttons)) {
    		OnButton2();
    	}
    	if (OnButton3 != null && button3.buttonUp(e.Buttons)) {
    		OnButton3();
    	}
    	if (OnButton4 != null && button4.buttonUp(e.Buttons)) {
    		OnButton4();
    	}
    	if (OnJoystickButton != null && joystickButton.buttonUp(e.Buttons)) {
    		OnJoystickButton();
    	}
    }
}