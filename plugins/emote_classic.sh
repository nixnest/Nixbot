#!/bin/bash
shift
case $1 in
    "help")
        echo "Pass this command a string, and it will do it's best to determine how the author of that string is feeling"
        ;;
    *)
        string=$*
	echo "**Input:**\`$*\`"
        string=${string// /%20}
        response=$(curl -s -X GET --header 'Accept: application/json' --header 'Content-Language: en' --header 'Accept-Language: en' "https://watson-api-explorer.mybluemix.net/tone-analyzer/api/v3/tone?text=$string&version=2017-09-20&sentences=false&tones=emotion")
        echo $response > /dev/null
        echo -e "The supercomputer that beat _Jeopardy!_ is:\n"
        madraw=$(echo $response | jq -r '.document_tone.tone_categories[0].tones[0].score')
        disgustraw=$(echo $response | jq -r '.document_tone.tone_categories[0].tones[1].score')
        fearraw=$(echo $response | jq -r '.document_tone.tone_categories[0].tones[2].score')
        joyraw=$(echo $response | jq -r '.document_tone.tone_categories[0].tones[3].score')
        sadraw=$(echo $response | jq -r '.document_tone.tone_categories[0].tones[4].score')
        mad=$(bc <<< "(($madraw*100)+0.5)/1")
        disgust=$(bc <<< "(($disgustraw*100)+0.5)/1")
        fear=$(bc <<< "(($fearraw*100)+0.5)/1")
        joy=$(bc <<< "(($joyraw*100)+0.5)/1")
        sad=$(bc <<< "(($sadraw*100)+0.5)/1")
        echo -e "$mad% sure this user is **Angry**\n$disgust% sure this user is **Disgusted**\n$fear% sure this user is **Fearful**\n$joy% sure this user is **Joyful**\n$sad% sure this user is **Sad**"
        ;;
esac


