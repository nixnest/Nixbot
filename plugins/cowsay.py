#!/usr/bin/env python3

import sys
import subprocess

if len(sys.argv) < 3:
    reply = "Missing parameters"
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    try:
        reply = "``` {} ```".format(subprocess.check_output(["cowsay"]+args, universal_newlines=True))
    except subprocess.CalledProcessError:
        reply = "Something messed up, was it you?"

try:
    print(reply)
except NameError:
    pass
