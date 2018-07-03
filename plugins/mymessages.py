#!/usr/bin/env python3

import sys
import json
import requests

res = requests.get(
    "http://oort.zwater.us:8086/query",
    params={
        'db': 'nixnest',
        'q': "SELECT sum(value) + sum(manual) FROM message WHERE \"id\"='{}' GROUP BY id fill(0)".format(sys.argv[1])
    }
).json()

if "series" in res['results'][0]:
    reply = "Currently, we've logged {} messages from you.\nIf this is incorrect, run \`+messages \$YOUR_MESSAGE_COUNT\`, or ask a mod.".format(res['results'][0]['series'][0]['values'][0][1])
else:
    reply = "Got a null response. Either this is your first message, or there's a backend problem."

print(reply)
