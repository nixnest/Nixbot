#!/bin/bash
channel=$(echo $1 | tr --delete '[<>#]')
#echo $channel
shift
message=$*
if [ -e /home/zack/dbot/logs/$channel ]
then
	echo -e "$(tail -99 /home/zack/dbot/logs/$channel)\n$message" > /home/zack/dbot/logs/$channel
else
	echo -e $message\n > /home/zack/dbot/logs/$channel
fi
