#pragma strict

@script ExecuteInEditMode()

public var renderCaveWalls : boolean;

function Update () {
	for (var wallRenderer : MeshRenderer in gameObject.GetComponentsInChildren.<MeshRenderer>() ) {
		wallRenderer.enabled = renderCaveWalls;
	}
}