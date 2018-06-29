#!/usr/bin/env python3

import sys
import subprocess

if len(sys.argv) < 2:
    reply = "Missing parameters"
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    cmd = " ".join(args)
    try:
        reply = subprocess.check_output(["fortune"])
    except subprocess.CalledProcessError:
        reply = "Something messed up, was it you?"
try:
    print(reply)
except NameError:
    pass
