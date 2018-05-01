#!/bin/bash
case $1 in
    "help")
        echo 'Accepts -f and -l, in the same manner that `cowsay` usually does'
        ;;
    "-f")
        cow=$2
        shift
        shift
        echo -e "\`\`\`$(cowsay -f $cow $*)\`\`\`"
        ;;
    "-l")
        cowsay -l
        ;;
    *)
        echo -e "\`\`\`$(cowsay $*)\`\`\`"
        ;;
esac
