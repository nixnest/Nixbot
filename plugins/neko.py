#!/usr/bin/env python3

import sys
import json
import urllib3

url = "https://nekos.life/api/v2/img/"
options = [ "cum", "les", "meow", "tickle", "lewd", "feed", "bj", "nsfw_neko_gif", "poke", "anal", "slap", "avatar", "pussy", "lizard", "classic", "kuni", "pat", "kiss", "neko", "cuddle", "fox_girl", "boobs", "Random_hentai_gif", "hug"]
http = urllib3.PoolManager()

def optionslist(opts):
    l = ""
    for opt in opts:
        l += opt + " "
    m = l.strip()
    return m   

query = ""
for opt in options:
    if (sys.argv[2].lower() == opt):
        query = opt

if (query == ""): 
    reply = "That's not an option you baka! (\`⌒´メ)\nValid options are `" + optionslist(options) + "`"
else:
    endpoint = url + query
    fetch = http.request('GET', endpoint)
    data = json.loads(fetch.data)
    reply = "Here's your lewds!  °˖✧◝(⁰▿⁰)◜✧˖°\n" + data['url']

print(reply)
