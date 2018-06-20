#!/bin/bash
source ./emote_config.conf
channel=$(echo $1 | tr --delete '[<>#]')
#echo $channel
shift
message=$*
if [ -e /home/zack/dbot/logs/$channel ]
then
    echo -e "$(tail -99 $logDir/$channel)\n$message" > $logDir/$channel
else
    echo -e "$message" >> $logDir/$channel
fi
