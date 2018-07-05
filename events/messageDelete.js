// messageDelete.js

module.exports = async (config, client, influx, message) => {
    embedFields = fieldGenerator(message.cleanContent, "Message");
    console.log(embedFields)
    client.channels.get(config.logchannel).send({embed: {
        color: config.colors.red,
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL
        },
        url: urlGenerator(message),
        title: "Message ID#" + message.id + " deleted in #" + message.channel.name,
        description: "The following message was deleted:",
        fields: embedFields,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL,
            text: "User ID: " + message.author.id,
        }
        
    }});
}

const embedLength = 1020;

function lengthSplit (message, length) {
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
};
    
function fieldGenerator (message, msgTitle) {
        console.log(msgTitle)
        console.log(message)
        splits = lengthSplit(message, embedLength);
        fields = [];
        if (splits.length = 1) {
            fields = [{
                name : msgTitle,
                value : "` " + splits[0] + " `" 
            }];
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
};

function urlGenerator (msgObj) {
    url = "https://discordapp.com/channels/" + msgObj.guild.id + "/" + msgObj.channel.id + "/" + msgObj.id
    return url
}
