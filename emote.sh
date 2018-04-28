#!/bin/bash
source ./emote_config.conf
case $1 in
    "help")
        echo "this is the help text"
        ;;
    *)
        ####
        #
        # Read the logs cooresponding to the channel ID we were passed, get the top 50 words, filtering out common stop words,
        # then get the top five words that are also nouns, proper or otherwise
        #
        case $1 in
            "custchannel")
                shift
                declare channel=$(echo $1 | tr --delete '[<>#]')
                declare thischannel="That channel"
                shift
                ;;
            *)
                declare channel=$(echo $1 | tr --delete '[<>#]')
                declare thischannel="This channel"
                shift
                ;;
        esac
        ostring=$(cat $logDir/$channel)
        ostring2=$(echo -e $ostring | tr "\"" " ")
        words=$(echo $ostring | tr -c '[:alpha:]' '[\n*]' | fgrep -v -w -i -f /usr/share/groff/current/eign | sort -i | uniq -c | sort -nr \
            | head -50 | awk '{print $2}' | xargs -d "\n" -n 1 -I search fgrep -x -i 'search' $nounList | uniq -i | head -5 | tac)

        ####
        #
        # Now we construct a json file for sending to Watson that contains the text and keywords to get emotions on
        #

        targets=""
        for word in $words
        do
            targets="$targets\",\"$word"
        done
        targets=$(echo $targets\" | cut -c 3-)
        echo -e  "{\"text\": \"$ostring2\",\"features\": {\"emotion\": { \"targets\":[$targets]}}}" > $paramDir/parameters$channel.json

        ####
        #
        # Pass our file to Watson
        #

        response=$(curl -s -X POST \
            -H "Content-Type: application/json" \
            -u "$watsonUser":"$watsonPass" \
            -d @$paramDir/parameters$channel.json \
            "https://gateway.watsonplatform.net/natural-language-understanding/api/v1/analyze?version=2018-03-16")

        ####
        #
        # Do bunches of string manipulation and calls to jq based on the response from Watson
        #
        # Iterate through the responses, fetching values for each emotion on each keyword
        #

        numKeys=$(echo $response | jq '.emotion.targets[] | length'| wc -l)
        if [ "$numKeys" -eq "0" ]
        then
            echo "Couldn't find any useful information. Either there are not enough messages for analysis, or there hasn't been enough focused discussion to make a judgement."
            echo "Basically, you're all boring."
            exit 0
        fi
        echo -e "\n _IBM Watson_ has determined that:\n"
        while ((numKeys--)); do
            x=5
            emotions=" "
            keyword=$(echo $response | jq -r ".emotion.targets[$numKeys].text")
            values=$(echo $response | jq -r "[.emotion.targets[$numKeys].emotion[]]")
            while ((x--)); do
                case $x in
                    "0")
                        declare key="sad";;
                    "1")
                        declare key="happy";;
                    "2")
                        declare key="fearful";;
                    "3")
                        declare key="disgusted";;
                    "4")
                        declare key="angry";;
                esac
                percent="$(echo $values | jq -r ".[$x]" | awk '{ print sprintf("%.9f", $1); }')"
                percentProc=$(bc <<< "(($percent*100)+0.5)/1")
                emotion="$(echo "$percent $key**($percentProc%),")"
                emotions="$(echo "$emotions $emotion")"
            done

            ####
            #
            # Only grab the top two highest responses, to keep things clean
            #
            final=$(echo $emotions | tr "," "\n" | sort -nr | head -2 | awk '{print $2}')
            first=1
            echo -n "This channel is "
            for feel in $final; do
                case $first in
                    1)
                        echo -n "mostly **$feel, but also";;
                    0)
                        echo -n " **$feel about";;
                esac
                first=0
            done
            echo " **$keyword**"
            echo " "
        done

        ####
        #
        # Do much of the same thing for getting a global emotion on the whole body of text we sent
        #
        globalVals=$(echo $response | jq -r "[.emotion.document.emotion[]]")
        x=5
        while ((x--)); do
            case $x in
                "0")
                    declare key="sad";;
                "1")
                    declare key="happy";;
                "2")
                    declare key="fearful";;
                "3")
                    declare key="disgusted";;
                "4")
                    declare key="angry";;
            esac

            percent="$(echo $values | jq -r ".[$x]" | awk '{ print sprintf("%.9f", $1); }')"
            percentProc=$(bc <<< "(($percent*100)+0.5)/1")
            emotion="$(echo "$percent $key**($percentProc%),")"
            emotions="$(echo "$emotions $emotion")"
        done
        final=$(echo $emotions | tr "," "\n" | sort -nr | head -1 | awk '{print $2}')
        echo "Overall, we're **$final"
        echo " "
        echo "_This information was returned by IBM watson after getting the top five most-used nouns in the last 100 messages, then sending the entire text of the last 100 messages to watson, asking for general feeling towards each of the five keywords. All information is stored and transmitted stripped of any identifying data._"
        echo " "
        echo "_Results at the top are more accurate. Results at the bottom are likely to be garbage_"
        ;;
esac
