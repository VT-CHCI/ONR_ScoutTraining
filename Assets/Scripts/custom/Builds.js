#pragma strict

@script ExecuteInEditMode()

public var serverBuild : boolean;
public var crateSpawner : GameObject;
public var beaconSpawner : GameObject;

function Update () {
	GetComponent(ServerManager).enabled = serverBuild;
	GetComponent(TrackingManager_v2).enabled = serverBuild;
	GetComponent(WandEventManager).enabled = serverBuild;
	GetComponent(ClientManager).enabled = !serverBuild;

	crateSpawner.active = serverBuild;
	beaconSpawner.active = serverBuild;
}