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
        reply = "``` {} ```".format(subprocess.check_output(["fortune"], universal_newlines=True))
    except subprocess.CalledProcessError:
        reply = "Something messed up, was it you?"

print(reply)
