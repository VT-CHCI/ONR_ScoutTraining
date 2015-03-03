#pragma strict

public var collisionPlane : GameObject;
public var binoculars : GameObject;

private var plane : Collider;
private var hit : RaycastHit;
private var ray : Ray;

function Start () {
	plane = collisionPlane.collider;
	ray = new Ray (transform.position, transform.forward);
}

function Update () {
	if (plane.Raycast (ray, hit, 100.0)) {
        Debug.DrawLine(ray.origin, hit.point);
        binoculars.transform.position = hit.point;
	}
}