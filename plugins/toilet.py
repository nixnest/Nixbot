#!/usr/bin/env python3

import sys
import os
import subprocess

if len(sys.argv) < 2:
    reply = "Missing parameters"
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    if '-f' in args:
        try:
            reply = "``` {} ```".format(subprocess.check_output(["toilet"]+args, universal_newlines=True))
        except subprocess.CalledProcessError:
            reply = "Something messed up, was it you?"
    else:
        try:
            reply = "``` {} ```".format(subprocess.check_output(["toilet", "-f", "sans"]+args))
        except subprocess.CalledProcessError:
            reply = "Something messed up, was it you?"

print(reply)
