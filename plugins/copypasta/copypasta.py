#!/usr/bin/env python3

import json
import sys

pastafile = "./plugins/copypasta/copypastas.json"


def commandlist(obj):
    commands = ""
    for key in obj:
        commands += str(key) + " "
        cmds = "`"+commands.strip().replace(" ", ", ")+"`"
    return cmds

with open(pastafile) as pf:
    try:
        obj = json.load(pf)
    except ValueError:
        print('Error loading JSON from file')

if (len(sys.argv) < 3):
    cmds = commandlist(obj)
    reply = "Missing argument. Current available copypasta are: " + cmds
else:
    pasta = ""
    for key in obj:
        if (sys.argv[2] == key):
            pasta = obj[key]
    if (pasta == ""):
        cmds = commandlist(obj)
        reply = "Invalid argument. Current available copypasta are: " + cmds
    else:
        reply = pasta

print(reply)
