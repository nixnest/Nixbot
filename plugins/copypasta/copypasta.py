#!/usr/bin/env python3

import json
import sys

def commandlist():
    commands = ""
    for key in obj:
        commands += str(key) + " "
        cmds = "`"+commands.strip().replace(" ", ", ")+"`"
    return cmds

with open('copypasta.json') as fp:
    try:
        obj = json.load(fp)
    except ValueError:
        print('error loading JSON')

if (len(sys.argv) < 3):
    cmds = commandlist() 
    reply = "Missing argument. Current available copypasta are: " + cmds
else:
    pasta = ""
    for key in obj:
        if (sys.argv[2] == key):
            pasta = obj[key]
    if (pasta == ""):
        cmds = commandlist()
        reply = "Invalid argument. Current available copypasta are: " + cmds
    else:
        reply = pasta

print(reply)
