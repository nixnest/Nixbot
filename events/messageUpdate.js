//messageUpdate.js

module.exports = async (config, client, oldmsg, newmsg) => {
    if (oldmsg.cleanContent !== newmsg.cleanContent) {
        oldFields = fieldGenerator(oldmsg.cleanContent, "Old message");
        newFields = fieldGenerator(newmsg.cleanContent, "New message");
        embedFields = oldFields.concat(newFields);
        console.log(embedFields)
        client.channels.get(config.logchannel).send({embed: {
            color: config.colors.orange,
            author: {
                name: newmsg.author.username,
                icon_url: newmsg.author.displayAvatarURL
            },
            url: urlGenerator(newmsg),
            title: "Message ID#" + newmsg.id + " modified in #" + newmsg.channel.name,
            description: "The following message was modified:",
            fields: embedFields,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL,
                text: "User ID: " + newmsg.author.id,
            }
        }})
    }
}

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
