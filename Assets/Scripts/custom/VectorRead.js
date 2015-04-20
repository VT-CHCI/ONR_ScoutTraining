#pragma strict

import System.Xml;
import System.IO;

/*
	Read XML-Positions:
	- If the correct xml file exists, it is read into the asset String
	- The reader var is used to navigate through the xml file
	- If the tag contains the string "position", then add the (x, y, z) coordinates
	  to the list of Vector3s.
*/
function Start () {
	var asset : String;
		
	if (System.IO.File.Exists(Application.dataPath+"/Resources/TrialData.xml") || 
		System.IO.File.Exists(Application.dataPath+"/Assets/XML/TrialData.xml")) {
		asset = System.IO.File.ReadAllText(Application.dataPath+"/Resources/TrialData.xml");
			
		if(asset != null) {
			readXML(asset);
		}
		else {
			asset = System.IO.File.ReadAllText(Application.dataPath+"/Assets/XML/TrialData.xml");
			readXML(asset);
		}	
	}
}

function readXML(asset : String) {
	var list : List.<Vector3>;
	var tempV : Vector3;
	
	var reader : XmlTextReader = new XmlTextReader(new StringReader(asset));
	while(reader.Read()) {
	if(reader.Name.Contains("beacon")) {
		if(float.TryParse(reader.GetAttribute("x"), tempV.x) && float.TryParse(reader.GetAttribute("y"), tempV.y) && float.TryParse(reader.GetAttribute("z"), tempV.z)) {
			list.Add(tempV);
			}
		}
	}
}