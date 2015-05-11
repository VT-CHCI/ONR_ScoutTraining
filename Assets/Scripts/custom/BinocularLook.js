#pragma strict

public var collisionPlane : GameObject;
public var binoculars : GameObject;

private var plane : Collider;
private var hit : RaycastHit;
private var ray : Ray;

/*
	Finds the appropriate plane's collider
	Creates a ray that points forward from the user's position
*/
function Start () {
	plane = collisionPlane.collider;
	ray = new Ray (transform.position, transform.forward);
}

/*
	Shoots a ray 100 units forward, which collides with the plane
	Set the binoculars position to the intersection point in the plane
*/
function Update () {
	if (plane.Raycast (ray, hit, 100.0)) {
        Debug.DrawLine(ray.origin, hit.point);
        binoculars.transform.position = hit.point;
	}
}