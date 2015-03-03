#pragma strict

/*
	Class Variables:
	- XML File that will contain the beacon coordinates
	- List of Vector3's that represent the beacon locations
	- Boolean deciding whether or not to remove the beacons from the world
	- Prefab object that will be cloned to create multiple beacons in the actual scene
*/
private var asset : String;
private var list : List.<Vector3> = new List.<Vector3>();
private var destroyBeacons : boolean = false;
public var beaconPrefab : GameObject;

/*
	Start:
	- Read in the initial trial of beacon data
	- Spawn the beacons in the world
*/
function Start () {
	readXMLData();
	
	//instantiateBeacons();
}

/*
	Update (Every frame):
	- Check to see if the 'B' button is pressed
	- If it is, toggle the boolean and either destroy or create the beacons
*/
function Update () {
	if(Input.GetKeyDown(KeyCode.B)) {
		destroyBeacons = !destroyBeacons;

		if(destroyBeacons) {
			destroyAllBeacons();
		}
		else {
			instantiateBeacons();
		}

	}
}

/*
	Spawn Beacons:
	- Traverses the list of beacon Vector3's and creates them from a prefab
	- Sets the initial color to blue (will change later) and adds a tag for easy searching when destroying
*/
function instantiateBeacons() {
	var newBeacon : GameObject;
	for(position in list) {
		newBeacon = Network.Instantiate(beaconPrefab, position, Quaternion.identity, 0);
		newBeacon.GetComponent(Beacon).setColor(Color.red);
		newBeacon.tag = "Beacon";
	}
}

/*
	Destroy Beacons:
	- Find all the game objects with tag "Beacon"
	- Destroy all of those objects
*/
function destroyAllBeacons() {
	for(beacon in GameObject.FindGameObjectsWithTag("Beacon")) {
		if(Network.isServer) {
			Network.Destroy(beacon);
		}
	}
}

/*
	XML Reader:
	- Find the xml file named "TrialData.xml"
	- Find all of the (x, y, z) values within the beacon tags
*/
function readXMLData() {
	var tempV : Vector3;
	var filePath : String;
	
	if (Application.isEditor) {
		filePath = "Assets/XML/TrialData.xml";
	} else {
		filePath = Application.dataPath+"/Resources/TrialData.xml";
	}

	if(System.IO.File.Exists(filePath)) {
		asset = System.IO.File.ReadAllText(filePath);
			
		if(asset != null) {
			var reader : XmlTextReader = new XmlTextReader(new StringReader(asset));
		    while(reader.Read()) {
		    	if(reader.Name.Contains("beacon")) {
		    		if(float.TryParse(reader.GetAttribute("x"), tempV.x) && float.TryParse(reader.GetAttribute("y"), tempV.y) && float.TryParse(reader.GetAttribute("z"), tempV.z)) {
		    			list.Add(tempV);
		    		}
		    	}
		    }
		}
	}
}

/*
	Parse Color:
	- Takes a string and converts it to a color 
	- Format is "1.0, 1.0, .35, 1.0" - spaces are important
*/
function ParseColor (col : String) : Color {
	var strings = col.Split(", "[0] );
	var output : Color;

	for (var i = 0; i < 4; i++) {
		output[i] = System.Single.Parse(strings[i]);
	}

	return output;
}