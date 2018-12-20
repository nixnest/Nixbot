#!/usr/bin/env python3

import sys
import json
import requests
import random

headers = {
    'User-Agent': 'Godzilla/5.0 (X11; Linus x86_64; rv:61.0)'
}

endpoint = "https://discordapp.com/api/oauth2/applications/@me"

reply = requests.get(
    endpoint,
    headers=headers
).json()


try:
    print(reply)
except NameError:
    pass
