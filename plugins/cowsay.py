#!/usr/bin/env python3

import sys
import os

if len(sys.argv) < 3:
    reply = "Missing parameters"
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    cmd = " ".join(args)
    reply = "` {} `".format(os.popen("cowsay {}".format(cmd)).read())

try:
    print(reply)
except NameError:
    pass
