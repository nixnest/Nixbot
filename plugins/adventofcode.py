#!/usr/bin/env python3

import requests

SESSION_COOKIE = "53616c7465645f5f9f26202190bf8a24af452b84bdfc7ac0153ac0f32ca4bab16f8f21b2a603b811df0771bcf371b546"
LEADERBOARD_URL = "https://adventofcode.com/2018/leaderboard/private/view/227196.json"

cookies = {
    'session': SESSION_COOKIE
}

leaderboard = requests.get(LEADERBOARD_URL, cookies=cookies).json()
members = leaderboard['members']

table = "\nCurrent Advent of Code 2018 ranking:\n"

for member in sorted(members.values(), key=lambda k: k['local_score'], reverse=True):
    table += '{0:<22} {1:>5}\n'.format(member['name'], member['local_score'])

print("```{}```".format(table))
