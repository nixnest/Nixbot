#!/usr/bin/env python3

import sys

if len(sys.argv) < 3:
    # reply = "Missing parameters"
    arg = sys.argv[1]
    reply = "*<@{}? will remember that*".format(arg)
else:
    args = sys.argv
    args.pop(0)
    args.pop(0)

    reply = "*{} will remember that*".format(" ".join(args))


print(reply)
