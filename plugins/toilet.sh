#!/bin/bash
shift
case $1 in
    "help")
        echo 'Works just like toilet'
        ;;
    *)
        echo "\`\`\`$(toilet -f sans $*)\`\`\`"
        ;;
esac
