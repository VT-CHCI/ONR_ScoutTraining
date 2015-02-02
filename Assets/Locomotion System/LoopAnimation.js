#pragma strict

var endPoint : Vector3;
var duration : float = 1.0;
 
private var startPoint : Vector3;
private var startTime : float;

private var startMoving : boolean = false;

function Start () {
	displayRenderers(false);
	
	animation.wrapMode = WrapMode.ClampForever;
	animation.Play("die");
	//animation.wrapMode = WrapMode.Loop;
	//animation["die"].speed = -0.5;
	//animation["die"].time = animation["die"].length;
}

function Update () {
	if (startMoving)
		transform.position = Vector3.Lerp(startPoint, endPoint, (Time.time - startTime) / duration);
}

function OnTriggerEnter (other : Collider) {
	if (!animation.IsPlaying("dance")) {
		Debug.Log("Entered space, start animation'");
		
		animation.wrapMode = WrapMode.Default;
		displayRenderers(true);
		
		startPoint = transform.position;
	    startTime = Time.time;
	    startMoving = true;
	
		animation["die"].speed = -0.5;
		animation["die"].time = animation["die"].length;
		
		animation.Play("die");
		
		animation.CrossFadeQueued("idle", 5.0F, QueueMode.CompleteOthers);
		animation["dance"].wrapMode = WrapMode.Loop;
		animation.CrossFadeQueued("dance", 5.0F, QueueMode.CompleteOthers);
	}
}

function displayRenderers (show : boolean) {
	var renderers : Component[];
	renderers = GetComponentsInChildren (MeshRenderer);
	
	for (var renderer : MeshRenderer in renderers) {
		renderer.enabled = show;
	}
	
	var skinnedRenderers : Component[];
	skinnedRenderers = GetComponentsInChildren (SkinnedMeshRenderer);
	
	for (var skinnedRenderer : SkinnedMeshRenderer in skinnedRenderers) {
		skinnedRenderer.enabled = show;
	}
	
	var particleRenderers : Component[];
	particleRenderers = GetComponentsInChildren (ParticleRenderer);
	
	for (var particleRenderer : ParticleRenderer in particleRenderers) {
		particleRenderer.enabled = show;
	}
}