// messageUpdate.js

const extra = require('./../modules/extraneous')

module.exports = async (config, client, influx, oldmsg, newmsg) => {
    if (oldmsg.cleanContent !== newmsg.cleanContent) {
        var oldFields = extra.fieldGenerator(oldmsg.cleanContent, 'Old message')
        var newFields = extra.fieldGenerator(newmsg.cleanContent, 'New message')
        var embedFields = oldFields.concat(newFields)
        console.log(embedFields)
        client.channels.get(config.logchannel).send({embed: {
            color: config.colors.orange,
            author: {
                name: newmsg.author.username,
                icon_url: newmsg.author.displayAvatarURL
            },
            url: extra.urlGenerator(newmsg),
            title: 'Message ID#' + newmsg.id + ' modified in #' + newmsg.channel.name,
            description: 'The following message was modified:',
            fields: embedFields,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL,
                text: 'User ID: ' + newmsg.author.id
            }
        }})
    }
}
