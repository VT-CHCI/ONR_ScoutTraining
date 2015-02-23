#pragma strict

private var asset : String;
private var list : List.<Vector3> = new List.<Vector3>();
private var destroyBeacons : boolean = false;
public var beaconPrefab : GameObject;

function Start () {
	readXMLData();
	
	var newBeacon : GameObject;
	for(position in list) {
		newBeacon = Instantiate(beaconPrefab, position, Quaternion.identity);
		newBeacon.GetComponent(Beacon).setColor(Color.blue);
	}
}

function Update () {

}

function readXMLData() {
	var tempV : Vector3;
	
	//if (System.IO.File.Exists(Application.dataPath+"/Resources/config.xml")) {
	  if(System.IO.File.Exists("Assets/XML/TrialData.xml")) {
		asset = System.IO.File.ReadAllText("Assets/XML/TrialData.xml");
			
		if(asset != null) {
			var reader : XmlTextReader = new XmlTextReader(new StringReader(asset));
		    while(reader.Read()) {
		    	if(reader.Name.Contains("beacon")) {
		    		if(float.TryParse(reader.GetAttribute("x"), tempV.x) && float.TryParse(reader.GetAttribute("y"), tempV.y) && float.TryParse(reader.GetAttribute("z"), tempV.z)) {
		    			list.Add(tempV);
		    			Debug.Log(tempV);
		    		}
		    	}
		    }
		}
	}
}