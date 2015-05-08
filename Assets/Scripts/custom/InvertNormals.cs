using UnityEngine;
using System.Collections;
using System.Linq;

public class InvertNormals : MonoBehaviour {

	// Use this for initialization
	void Start () {
		Mesh mesh = GetComponent<MeshFilter> ().mesh;
		mesh.triangles = mesh.triangles.Reverse().ToArray();
	}
	
	// Update is called once per frame
	void Update () {
	
	}
}
