//extraneous.js

module.exports = {
    embedLength: 1020,
    lengthSplit: function (message, length) {
        splitCount = Math.floor( message.length / length) + 1;
        splits = [];
    
        for (n = 0; n < splitCount; n++) {
            splits.push(message.substr(0+(n*length), length));
        }
    
        return splits;
    },
    
    fieldGenerator: function (message, msgTitle) {
        splits = module.exports.lengthSplit(message, module.exports.embedLength);
        fields = [];
    
        for (n = 0; n < splits.length; n++) {
            fields.push({
                name : msgTitle + " (" + n + ")",
                value : "` " + splits[n] + " `"
            })
        }
    
        return fields;
    }
}