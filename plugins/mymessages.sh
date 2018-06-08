#!/bin/bash
id="$1"
output=$(curl -s -G 'http://oort.zwater.us:8086/query' --data-urlencode "db=nixnest" --data-urlencode "q=SELECT sum(value) + sum(manual) FROM message WHERE \"id\"='$id' GROUP BY id fill(0)")
#echo $output
msgs=$(echo $output | jq -r '.results[0].series[0].values[0][1]')
if [ "$msgs" = "null" ]
then
    echo "Got a null response. Either this is your first message, or there's a backend problem."
else
    echo -e "Currently, we've logged $msgs messages from you.\nIf this is incorrect, run \`+messages \$YOUR_MESSAGE_COUNT\`, or ask a mod."
fi
