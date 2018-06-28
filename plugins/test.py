#!/usr/bin/env python3

import sys

args = sys.argv
args.pop(0)
args.pop(0)

reply = "this is a test plugin for Nixbot. Hello world\n"
reply += "arguments: {}".format(" ".join(args))

print(reply)
