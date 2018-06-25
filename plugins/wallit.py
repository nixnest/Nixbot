#! /usr/bin/python3

"""Parse the top /r/Art posts for a wallpaper meeting given criteria."""
#Script originally made by @Aperture#3661 on Discord


import sys #Needed for arguments
import json #Needed to parse response
import requests #Needed for talking to reddit

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0)'
}

if (len(sys.argv) < 4):
    reply = "Required arguments: [Subreddit] [HeightxWidth]"
else:
    reply = "Couldn't find one, you picky (or pervy) fuck."
    subreddit = sys.argv[2]
    resolution = sys.argv[3].split('x')
    c_width, c_height = (
        int(pix) for pix in resolution
    )

    posts = requests.get(
        'https://www.reddit.com/r/' + subreddit + '/top.json?sort=top&t=day',
        headers=headers
    ).json()

    for post in posts['data']['children']:
        url, width, height = post['data']['preview']['images'][0]['source'].values()
        width, height = int(width), int(height)
        if all((
            width >= c_width,
            height >= c_height,
            width > height,
            not post['data']['over_18']
        )):
            reply = 'Found "'+post['data']['title']+'" at resolution '+str(width)+'x'+str(height)+': ' + url
            break

print(reply)


