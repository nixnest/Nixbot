#!/usr/bin/env python3
import urllib.parse
import urllib.request
import json
from operator import itemgetter
influxUrl = 'http://oort.zwater.us:8086/query'
values = {'db' : 'nixnest',
          'q' : 'SELECT sum("value") AS "sum_value" FROM "nixnest"."autogen"."message" WHERE time > now() - 7d GROUP BY time(1w), "id" FILL(none)'
         }
data = urllib.parse.urlencode(values)
data = data.encode('ascii')
request = urllib.request.Request(influxUrl, data)
with urllib.request.urlopen(request) as response:
    rawresults = response.read()
results = json.loads(rawresults)
#print(len(results["results"][0]["series"]))
stats = []
x=0
for result in results["results"][0]["series"]:
    messageCount = result["values"][0][1]
    userId = result["tags"]["id"]
    #key = '{ \'id\' : ' + str(userId) + ', \'count\' : ' + str(messageCount) + ' }'
    key = {'id':str(userId), 'count':str(messageCount)}
    stats.append(key)
#print(stats[1]['count'])
sortStats = sorted(stats, key=lambda k: int(k['count']), reverse=True)
print(json.dumps(sortStats[:10]))
#for test in stats:
#    print(test[1])
