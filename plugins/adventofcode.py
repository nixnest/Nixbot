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

table += '{0:3}  {1:4} {2:25} {3}\n'.format("", "", "        1111111111122222", "")
table += '{0:3}  {1:4} {2:25} {3}\n'.format("", "", "123456890123456789012345", "")


for position, member in enumerate(sorted(members.values(), key=lambda k: k['local_score'], reverse=True)):
    stars = ""
    for n in range(1,25):
        days = member['completion_day_level']
        if str(n) in days and days[str(n)]:
            if "2" in days[str(n)]:
                stars += '*'
            else:
                stars += '-'
        else:
            stars += ' '

    table += '{0:3}) {1:4} {2:25} {3}\n'.format(
            position + 1,
            member['local_score'],
            stars,
            member['name'],
        )

print("```{}```".format(table))
