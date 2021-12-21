# server-build-prep

Use this tool to exclude directories from your Unity build.  It is a bit of a hack, but it adds a tilda "~" to the end of all the directories you list to exclude.  It also adds a tilda to the corresponding .meta file.  There are functions that both add and remove the tilda, so just read the script to see how to execute.

An example usage would be if your project has a significant amount of assets like textures/images/audio/video/etc that you need to remove, say, for a server build.  You could run this script before and after each server build to trim down it's size.
