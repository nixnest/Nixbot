#!/usr/bin/env python3

"""Parse the top /r/Art posts for a wallpaper meeting given criteria."""

import re
import sys

import requests


size_pattern = re.compile(r'\[(\d+) ?[xX] ?(\d+)\]')
headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:61.0)'
}
subreddit_url = 'https://www.reddit.com/r/{0}/top.json?sort=top&t=day'


def run_wallit(args: list) -> str:
    """Take the arguments for the command, and return the response."""
    if len(args) < 4:
        return 'Required arguments: [Subreddit] [HeightxWidth]'
    subreddit, resolution = args[2], args[3].split('x')
    if not len(resolution) == 2:
        return 'Error: Invalid resolution'
    p_width, p_height = map(int, resolution)
    posts = requests.get(
        subreddit_url.format(subreddit), headers=headers
    ).json()
    if 'error' in posts:
        print(posts)
        return "Error: Couldn't get posts, is this a valid subreddit?"
    if not posts['data']['children']:
        return 'Error: Subreddit seems to have no posts.'

    for post in posts['data']['children']:
        if post['data']['over_18']:
            continue
        url = post['data']['url']

        if url.endswith(('jpg', 'png')):
            match = size_pattern.search(post['data']['title'])
            try:
                if match:
                    width, height = map(int, match.groups())
                else:
                    meta = post['data']['preview']['images'][0]['source']
                    width, height = meta['width'], meta['height']
            except Exception as e:
                print(e)
                continue
            if (
                width >= p_width and height >= p_height and
                width > height if p_width > p_height else True
            ):
                return 'Found {0} with resolution {1}x{2}'.format(
                    url, width, height
                )
    return "Error: Couldn't find one, you picky (or pervy) fuck."


if __name__ == '__main__':
    print(run_wallit(sys.argv))
