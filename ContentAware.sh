#!/usr/bin/env sh

# grab arguments
FILE="$1"
MULT1="$2"
MULT2="$3"

case "$FILE" in
    http*.[Pp][Nn][Gg]|http*.[Jj][Pp][Gg]|http*.[Jj][Pp][Ee][Gg])
        # file is a url
        curl -s "$FILE" -o /tmp/contentaware.png
        FILE="/tmp/contentaware.png"
        echo "file is a URL"
        ;;
    *)
        # file is not a url
        echo "file is not a URL"
        FILE="$PWD/$FILE"
        ;;
esac

# grab resolution parameters
set -- $(identify "$FILE")
RES="$3"
WIDTH="${3%x*}"
HEIGHT="${3#*x}"

if [ "$WIDTH" -gt "1920" ] || [ "$HEIGHT" -gt "1080" ]
then
    echo "resizing"
    convert "$FILE" -resize 1920x1080 -quality 100 "$FILE"
    set -- $(identify "$FILE")
    RES="$3"
    WIDTH="${3%x*}"
    HEIGHT="${3#*x}"
fi

# cas step one
H2="$(( HEIGHT/ (2 * MULT1) ))"
W2="$(( WIDTH/ (2 * MULT1) ))"
STR="${W2}x${H2}"

# cas step two
W3="$(( WIDTH * MULT2 ))"
H3="$(( HEIGHT * MULT2 ))"
STR2="${W3}x${H3}"

# do cas conversion
echo "Starting first stage"
convert -liquid-rescale $STR "$FILE" ./CAS_OUTPUT.jpg
echo "Starting Second stage"
convert -liquid-rescale $STR2 ./CAS_OUTPUT.jpg ./CAS_OUTPUT.jpg

echo "Done"
