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
    if '-f' in args:
        os.system("toilet {}".format(cmd))
        reply = "``` {} ```".format(os.popen("toilet {}".format(cmd)).read())
    else:
        reply = "``` {} ```".format(os.popen("toiet -f sans {}".format(cmd)).read())

try:
    print(reply)
except NameError:
    pass
