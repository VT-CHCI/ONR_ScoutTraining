#pragma strict

import System.Diagnostics;

class ScriptBatch extends MonoBehaviour {
    @MenuItem("MyTools/Windows Build With Postprocess")
    static function BuildGame() {
        // Get filename.
        var path = EditorUtility.SaveFolderPanel("Choose Location of Built Game", "", "");
        var levels : String[] = ["Assets/Bootcamp_v2"];
        
        // Build player.
        BuildPipeline.BuildPlayer(levels, path + "/BuiltGame.exe", BuildTarget.StandaloneWindows, BuildOptions.None);

        // Copy a file from the project folder to the build folder, alongside the built game.
        FileUtil.CopyFileOrDirectory("Assets/WebPlayerTemplates/Readme.txt", path + "Readme.txt");

        // Run the game (Process class from System.Diagnostics).
        var proc = new Process();
        proc.StartInfo.FileName = path + "BuiltGame.exe";
        proc.Start();
    }
}