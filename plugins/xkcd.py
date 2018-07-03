#!/usr/bin/env python3

import sys
import json
import requests
import random

headers = {
    'User-Agent': 'Godzilla/5.0 (X11; Linus x86_64; rv:61.0)'
}

endpoint = "https://xkcd.com/{}/info.0.json"

latest = requests.get(
    "http://xkcd.com/info.0.json",
    headers=headers
).json()['num']


def getJSON(id):
    data = requests.get(
        endpoint.format(id),
        headers=headers
    ).json()
    return data


def response(id, title, url, alt):
    reply = "#{}: {}\n".format(id, title) + \
            "{}\n".format(url) + \
            "*{}*".format(alt)
    return reply


def getComic(id):
    data = getJSON(id)
    comic = response(id, data['safe_title'], data['img'], data['alt'])
    return comic

comicid = sys.argv[2]

if len(sys.argv) < 3:
    reply = getComic(latest)
else:
    if comicid == "rand":
        id = random.randint(1, latest)
        reply = getComic(id)
    else:
        if comicid.isdigit():
            if int(sys.argv[2]) in range(1, latest):
                reply = getComic(int(sys.argv[2]))
        else:
            reply = getComic(latest)

try:
    print(reply)
except NameError:
    pass
