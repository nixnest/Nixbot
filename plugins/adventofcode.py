#!/usr/bin/env python3

import requests

SESSION_COOKIE = "53616c7465645f5f9f26202190bf8a24af452b84bdfc7ac0153ac0f32ca4bab16f8f21b2a603b811df0771bcf371b546"
LEADERBOARD_URL = "https://adventofcode.com/2018/leaderboard/private/view/227196.json"

cookies = {
    'session': SESSION_COOKIE
}

leaderboard = requests.get(LEADERBOARD_URL, cookies=cookies).json()

table = "\nCurrent Advent of Code 2018 ranking:\n"

for member in leaderboard['members'].values():
    table += "%s:\t%s\n" % (member['name'], member['local_score'])

print("```%s```" % table)

