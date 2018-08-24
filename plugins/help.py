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
            print('Error loading JSON from ' + jf)

plugins = loadJSON(pluginfile)
builtins = loadJSON(builtinfile)

# Makes a list of all avaliable commands (from json file)


def cmdList(cmds):
    cmdList = ""
    for cmd in cmds:
        cmdList += "**+{}:** {}\n".format(cmd, cmds[cmd]['description'])
    return cmdList

# Finds command info (from json file)


def cmdLookup(cmds):
    lookup = ""
    for cmd in cmds:
        if (arg == cmd):
            if (plugins[cmd]['arguments'] is None):
                info = "This command takes no arguments"
            else:
                info = ""
                args = plugins[cmd]['arguments']

                for cmdarg in args:
                    info = "`[{}]`: {}. Required? {}\n".format(cmdarg,
                                                               args[cmdarg]['msg'],
                                                               args[cmdarg]['required'])
            lookup = "**{}**: {}\n{}".format(cmd, plugins[cmd]['description'], info)
    return lookup

if len(args) < 3:
    # If there is no argument sent by user,
    # then display a list of possible commands
    cmdList = cmdList(builtins) + cmdList(plugins)
    reply = msgtitle + cmdList
else:
    # If they are asking for help with a specific command,
    # then get more deets on that
    arg = args[2].lower()
    lookup = "" + cmdLookup(builtins) + cmdLookup(plugins)
    if lookup == "":
        reply = "Command not found, prehaps you messed up?"
    else:
        reply = lookup

print(reply)
