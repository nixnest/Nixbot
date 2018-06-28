#!/usr/bin/env python3

"""Parse the top /r/Art posts for a wallpaper meeting given criteria."""
# Script originally made by @Aperture#3661 on Discord


import sys  # Needed for arguments
import json  # Needed to parse response
import requests  # Needed for talking to reddit

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0)'
}
config = {}

if (len(sys.argv) < 4):
    reply = "Required arguments: [Subreddit] [HeightxWidth]"
else:
    # Default string, if none of the posts in the list are good enough,
    # then this will display
    reply = "Error: Couldn't find one, you picky (or pervy) fuck."

    config['subreddit'] = sys.argv[2]

    resolution = sys.argv[3].split('x')
    if (len(resolution) == 2):
        config['width'], config['height'] = (
            int(pix) for pix in resolution
        )

        posts = requests.get(
            'https://www.reddit.com/r/' + config['subreddit'] +
            '/top.json?sort=top&t=day',
            headers=headers
        ).json()

        if ("error" in posts):
            reply = "Error: Couldn't get posts, " + \
                + "are you sure that's a valid subreddit?"
        else:
            if (len(posts['data']['children']) > 0):
                for post in posts['data']['children']:
                    if ("preview" in post['data']):
                        url, width, height = \
                            post['data']['preview']['images'][0]['source']
                        .values()

                        width, height = int(width), int(height)
                        if (width >= config['width'] and
                                height >= config['height'] and
                                width > height and
                                (not post['data']['over_18'])):
                            reply = 'Found "'+post['data']['title'] + \
                                    '" at resolution '+str(width)+'x' + \
                                    str(height)+': ' + url
                            break
            else:
                reply = "Error: subreddit seems to have no posts"
    else:
        reply = "Error: Invalid resolution"

print(reply)
