#!/usr/bin/env python3

import sys
import os

if len(sys.argv) < 2:
    reply = "Missing parameters"
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    cmd = " ".join(args)
    os.system("fortune {}".format(cmd))

try:
    print(reply)
except NameError:
    pass
