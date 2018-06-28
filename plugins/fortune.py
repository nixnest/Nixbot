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
    reply = "``` {} ```".format(os.popen("fortune {}".format(cmd)).read())

try:
    print(reply)
except NameError:
    pass
