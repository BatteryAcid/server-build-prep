/*
 * Requires npm to be installed.
 * To run, first move the server-build-prep project next to the target project directory.
 * Then, open a terminal window (or CMD prompt), and navigate to the top level of the target project directory.js
 *
 * node ../server-build-prep/server-build-prep.js
 */

// TODO: execute these based on input arguments
// TODO: make the cleanup process a little more robust to handle the different cases.

const fs = require('fs-extra');
const path = require('path');

const TILDA = "~";
const META_EXT = ".meta";

if (path.basename(process.cwd()) != "TOP_LEVEL_DIR_OF_YOUR_PROJECT") {
   console.log("current directory: " + path.basename(process.cwd()));
   console.log("Please run script from top level of TOP_LEVEL_DIR_OF_YOUR_PROJECT");
   process.exit(1);
}

const directoriesToExcludeFromServerBuild = [
   "./Assets/SomeFolderToExclude"
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
