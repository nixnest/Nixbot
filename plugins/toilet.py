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
            reply = subprocess.check_output(["toilet"]+args)
        except subprocess.CalledProcessError:
            reply = "Something messed up, was it you?"
    else:
        try:
            reply = subprocess.check_output(["toilet", "-f", "sans"]+args)
        except:
            reply = "Something messed up, was it you?"

try:
    print(reply)
except NameError:
    pass
