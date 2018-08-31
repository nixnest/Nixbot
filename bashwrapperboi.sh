#MAIM_LOCATION="/tmp/maim_screenie.png"
#MAIM_LOCATION_2="/tmp/maim_screenie2.png"
file="$1"
if (echo "$file" | grep -Eiq 'http.*\.(png|jpg|jpeg)')
then
    curl -s $file -o /tmp/deepfry.png
    file="/tmp/deepfry.png"
    #echo "file is a URL"
else
    #echo "file is not a URL"
    FILE="$PWD$SLASH$FILE"
fi
B_LOCATION="bsmol.png"
#maim -s $MAIM_LOCATION
dims=$(identify -format " %w %h " $file)
if [ $(echo $dims | awk '{print $1}') -gt 1920 ] || [ $(echo $dims | awk '{print $2}') -gt 1080 ]
then
    convert "$file" -resize 1920x1080 -quality 100 "$file"
    dims=$(identify -format " %w %h " $file)
fi
dims_b=$(identify -format " %w %h " $B_LOCATION)
deepfry=$(python3 frier.py $dims $dims $dims_b $file $B_LOCATION)
touch /tmp/deepfry_stage1.png
$($deepfry)
convert /tmp/deepfry_stage1.png -liquid-rescale 50% - | convert - -liquid-rescale 200% - | convert - -modulate 50,200 - | convert - -emboss 0x1.1 - | convert - +noise Gaussian -attenuate .5 deepfry_output.png
echo "Done"

#rm $MAIM_LOCATION
#rm $MAIM_LOCATION_2
