#!/usr/bin/env bash
FILE="$1"
SLASH="/"
if (echo "$FILE" | grep -Eiq 'http.*\.(png|jpg|jpeg)')
then
    curl -s $FILE -o /tmp/contentaware.png
    FILE="/tmp/contentaware.png"
    #echo "file is a URL"
else
    #echo "file is not a URL"
    FILE="$PWD$SLASH$FILE"
fi
MULT="$2"
#SLASH="/"
#FILE="$PWD$SLASH$FILE"
INFO=$(identify $FILE)
#echo $INFO
RES=$(echo $INFO | grep -o [0-9][0-9]*x[0-9][0-9]*\ )
#echo $RES
WIDTH=$(echo $RES | grep -o ^[0-9][0-9]*)
HEIGHT=$(echo $RES | grep -o [0-9][0-9]*$)
#echo $WIDTH $HEIGHT
if [ "$WIDTH" -gt "1920" ] || [ "$HEIGHT" -gt "1080" ]
then
    echo "resizing"
    convert "$FILE" -resize 1920x1080 -quality 100 "$FILE"
    INFO=$(identify $FILE)
    RES=$(echo $INFO | grep -o [0-9][0-9]*x[0-9][0-9]*\ )
    WIDTH=$(echo $RES | grep -o ^[0-9][0-9]*)
    HEIGHT=$(echo $RES | grep -o [0-9][0-9]*$)
fi
let HEIGHT2=$HEIGHT/"(2*$MULT)"
let WIDTH2=$WIDTH/"(2*$MULT)"
DEL="x"
STR=$WIDTH2$DEL$HEIGHT2
let W3=$WIDTH*$3
let H3=$HEIGHT*$3
STR2=$W3$DEL$H3
echo "Starting first stage"
convert -liquid-rescale $STR $FILE ./CAS_OUTPUT.jpg
echo "Starting Second stage"
convert -liquid-rescale $STR2 ./CAS_OUTPUT.jpg ./CAS_OUTPUT.jpg
echo "Done"
