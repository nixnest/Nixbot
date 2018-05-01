#!/bin/bash
current=$(curl -s https://xkcd.com/info.0.json)
max=$(echo $current | jq -r '.num')
rand=$(shuf -i 1-$max -n 1)
case $1 in
    "rand")
        output=$(curl -s "https://xkcd.com/$rand/info.0.json")
        ;;
    "num")
        output=$(curl -s "https://xkcd.com/$2/info.0.json")
        ;;
    *)
        output=$current
        ;;
esac
echo -e "#$(echo $output | jq -r '.num') $(echo $output | jq -r '.safe_title')\n$(echo $output | jq -r '.img')\n\n_$(echo $output | jq -r '.alt')_"
