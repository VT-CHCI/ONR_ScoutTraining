#pragma strict

@script AddComponentMenu("Camera-Control/Mouse Look")

public enum RotationAxes { MouseXAndY = 0, MouseX = 1, MouseY = 2 }
public var axes = RotationAxes.MouseXAndY;
public var sensitivityX = 15F;
public var sensitivityY = 15F;

public var minimumX = -360F;
public var maximumX = 360F;

public var minimumY = -60F;
public var maximumY = 60F;

private var rotationY = 0F;

function Update ()
{
	if (axes == RotationAxes.MouseXAndY)
	{
		var rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
		
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
		
		transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
	}
	else if (axes == RotationAxes.MouseX)
	{
		transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
	}
	else
	{
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
		
		transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
	}
}

function Start ()
{
	// Make the rigid body not change rotation
	if (rigidbody)
		rigidbody.freezeRotation = true;
}