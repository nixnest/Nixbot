#!/usr/bin/env python3

import sys

args = sys.argv
seperator = "+"
url = "https://wiki.archlinux.org/index.php?search="

if (len(sys.argv) > 2):
    q = ""
    args.reverse()
    args.pop()
    args.pop()
    args.reverse()
    for i in args:
        q += i + " "
    query = q.strip().replace(" ", seperator)
    reply = url + query
else:
    reply = "Discord's best practices for bots state that failed commands should fail silently"

print(reply)