/*
 * Requires npm to be installed.
 * To run, first move the server-build-prep project next to the enherjar-synergy-v2-full directory.
 * Then, open a terminal window (or CMD prompt), and navigate to the top level of the enherjar-synergy-v2-full project directory.js
 *
 * node ../server-build-prep/server-build-prep.js
 */

// TODO: execute these based on input arguments
// TODO: make the cleanup process a little more robust to handle the different cases.

const fs = require('fs-extra');
const path = require('path');

const TILDA = "~";
const META_EXT = ".meta";

if (path.basename(process.cwd()) != "enherjar-synergy-v2-full") {
   console.log("current directory: " + path.basename(process.cwd()));
   console.log("Please run script from top level of enherjar-synergy-v2-full");
   process.exit(1);
}

// NOTE: do not add Assets/SteamWorks Test 

const directoriesToExcludeFromServerBuild = [
   "./Assets/Sci_Fi_Armors_7/Textures",
   "./Assets/Resources/Stats Board Video Effects",
   "./Assets/beffio/The Hunt/Content/Textures/Model Textures",
   "./Assets/ASTROFISH_GAMES/MEDIEVAL_SERIES/MEDIEVAL_VILLAGE_HD/_Assets",
   "./Assets/Resources/Songs",
   "./Assets/Sci-fi Weapons Arsenal/Textures",
   "./Assets/Opsive/UltimateCharacterController/Demo/Animations/Items",
   "./Assets/Opsive/UltimateCharacterController/Demo/Animations/Abilities",
   "./Assets/Ancient Alien/Ancient Alien Environment/Content/3D/Objects",
   "./Assets/Sci_Fi_Armors_7/Animations",
   "./Assets/ScifiGrenadeLauncherGRL45/Textures",
   "./Assets/textures",
   "./Assets/Sci fi Environment/Textures",
   "./Assets/KriptoFX/Realistic Effects Pack v4/Effects/Textures",
   "./Assets/QFX/Sci-Fi VFX/Resources/Textures",
   "./Assets/Fantasy staffs PACK01/Textures",
   "./Assets/DreamForestTree/Textures",
   "./Assets/Opsive/DeathmatchAIKit/Demo/Textures",
   "./Assets/Skybox Pack 8k UHD/Textures",
   "./Assets/Resources/Sprites",
   "./Assets/Fonts"
];

//------------------------------------------------------------------------
// Utilities

function renameFile(fileToRename, renameTo) {
   fs.renameSync(fileToRename, renameTo);
}

function renameDirectory(dirToRename, renameDirTo) {
   //console.log(renameDirTo);
   if (!fs.existsSync(renameDirTo)) {
      console.log("changing directory: " + dirToRename + " to " + renameDirTo);
      fs.moveSync(dirToRename, renameDirTo);
   }
}

function isDirEmpty(dirname) {
   return fs.readdirSync(dirname).length === 0;
}

function getMetaFileNameWithPathAndTilda(dirname) {
   // console.log(path.basename(dirname));
   return path.dirname(dirname) + path.sep + path.basename(dirname) + TILDA + META_EXT;
}

//------------------------------------------------------------------------
// Utilities to use on their own when things get in a weird state

function fileExists(filenameWithPath) {
   if (fs.existsSync(filenameWithPath)) {
      //console.log("The file exists");
      return true;
   } else {
      //console.log("The file does not exist");
      return false;
   }
}

function removeTildaDirs(dirToRename) {
   let dirToRemove = dirToRename + TILDA;

   if (fs.existsSync(dirToRemove)) {
      console.log("removing dir: " + dirToRemove);
      fs.rmdirSync(dirToRemove, {
         recursive: true
      });
   }
}

function removeEmptyDirectory(dirToRemove) {
   if (fs.existsSync(dirToRemove) && isDirEmpty(dirToRemove)) {
      console.log("removing dir: " + dirToRemove);
      fs.rmdirSync(dirToRemove);
      let metaToRemove = getMetaFileNameWithPathAndTilda(dirToRemove);
      removeMetaFile(metaToRemove);
   }
}

function removeMetaFile(fileToRemove) {
   if (fileExists(fileToRemove)) {
      console.log("removing file: " + fileToRemove);
      fs.unlinkSync(fileToRemove);
   }
}

//------------------------------------------------------------------------
// Main functions to use

function processAddingTildaToDirectory(dirToRename) {
   if (fs.existsSync(dirToRename)) {
      let renameDirTo = dirToRename + TILDA;
      renameDirectory(dirToRename, renameDirTo);
   } else {
      console.log("Directory probably already has been changed: " + dirToRename);
   }
}

function ProcessAddTildaToMetaFile(dirToRename) {
   let metaFileToRename = dirToRename + META_EXT;
   let renameMetaFileTo = getMetaFileNameWithPathAndTilda(dirToRename);
   //console.log(metaFileToRename);
   //console.log(renameMetaFileTo);

   if (fileExists(metaFileToRename)) {
      console.log("Renaming meta file with Tilda: " + metaFileToRename + ", will now be: " + renameMetaFileTo);
      renameFile(metaFileToRename, renameMetaFileTo);
   } else {
      console.log("Tilda'ed Meta file already exists for file: " + metaFileToRename);
   }
}

function processRemovingTildaFromDirectory(dirToRename) {
   let dirWithTilda = dirToRename + TILDA;
   if (fs.existsSync(dirWithTilda)) {
      renameDirectory(dirWithTilda, dirToRename);
   } else {
      console.log("Directory does not exists, maybe already removed: " + dirWithTilda);
   }
}

function ProcessRemoveTildaFromMetaFile(dirToRename) {
   let metaFileWithoutTilda = dirToRename + META_EXT;
   let metaFileWithTilda = getMetaFileNameWithPathAndTilda(dirToRename);
   //console.log(metaFileWithoutTilda);
   //console.log(renameMetaFileTo);

   if (fileExists(metaFileWithTilda)) {
      console.log("Renaming meta file with Tilda: " + metaFileWithTilda + ", will now be: " + metaFileWithoutTilda);
      // from ~.meta to .meta
      renameFile(metaFileWithTilda, metaFileWithoutTilda);
   } else {
      console.log("Tilda'ed Meta file does not exists, maybe already removed: " + metaFileWithTilda);
   }
}

//------------------------------------------------------------------------
// Main process where the program is executed from

directoriesToExcludeFromServerBuild.forEach(function(dirToRename, index, array) {
   // From an untouch baseline, run these to exclude the directories from a build
   // adds tilda'd directories and meta files
   // processAddingTildaToDirectory(dirToRename);
   // ProcessAddTildaToMetaFile(dirToRename);

   // removing tilda'd directories and meta files
   // processRemovingTildaFromDirectory(dirToRename);
   // ProcessRemoveTildaFromMetaFile(dirToRename);
   // console.log("NOTE: You still may need to discard any changes to the meta files that occured during this process.");


   // clean up stuff in case things get in weird state
   // removeTildaDirs(dirToRename);
   // removeEmptyDirectory(dirToRename);

});