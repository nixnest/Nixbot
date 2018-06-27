//extraneous.js

module.exports = {
    embedLength: 1020,
    lengthSplit: (message, length) => {
        splitCount = Math.floor( message.length / length) + 1;
        splits = [];
    
        for (n = 0; n < splitCount; n++) {
            splits.push(message.substr(0+(n*length), length));
        }
        
        if (!splits[splits.length-1]) {
            splits.pop();
        }
        console.log(splits)
        return splits;
    },
    
    fieldGenerator: (message, msgTitle) => {
        splits = module.exports.lengthSplit(message, module.exports.embedLength);
        fields = [];
        if (splits.length = 1) {
            fields.concat({
                name : msgTitle,
                value : "` " + splits[0] + " `" 
            })
        } else {
            for (n = 0; n < splits.length; n++) {
                fields.push({
                    name : msgTitle + " (" + n + ")",
                    value : "` " + splits[n] + " `"
                })
            }
        }
        console.log(fields)
        return fields;
    }
}