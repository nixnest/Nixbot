#!/usr/bin/env python3

import sys
import json

path = "./plugins/"
pluginfile = path + "plugins.json"
builtinfile = path + "builtins.json"
args = sys.argv

msgtitle = "**Help**\n"

def loadJSON(jf):
    with open(jf) as f:
        try:
            return json.load(f)
        except ValueError:
            print('Error loading JSON from file')

plugins = loadJSON(pluginfile)
builtins = loadJSON(builtinfile)

#Makes a list of all avaliable commands (from json file)
def cmdList(cmds):
    cmdList = ""
    for cmd in cmds:
        cmdList += "`+" + cmd + "`: " + cmds[cmd]['description'] + "\n"
    return cmdList

#Finds command info (from json file)
def cmdLookup(cmds):
    lookup = ""
    for cmd in cmds:
        if (arg == cmd):
            if (plugins[cmd]['arguments'] == None):
                cmdargs = "This command takes no arguments"
            else:
                cmdargs = ""
                for cmdarg in plugins[cmd]['arguments']:
                    cmdargs += "`[" + cmdarg + "]`: " + plugins[cmd]['arguments'][cmdarg]['msg'] + \
                                ". Required? " + str(plugins[cmd]['arguments'][cmdarg]['required']) + "\n"
            lookup = "*" + cmd + "*: " + plugins[cmd]['description'] + "\n" + cmdargs
    return lookup


if (len(args) < 3):
    #If there is no argument sent by user, then display a list of possible commands
    cmdList = cmdList(builtins) + cmdList(plugins) 
    reply = msgtitle + cmdList
else:
    #If they are asking for help with a specific command, then get more deets on that
    arg = args[2].lower()
    lookup = "" + cmdLookup(builtins) + cmdLookup(plugins)
    if (lookup == ""):
        reply = "Command not found, prehaps you messed up?"
    else:
        reply = lookup

print(reply)