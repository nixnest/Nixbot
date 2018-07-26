// messageDelete.js

const extra = require('./../modules/extraneous')

module.exports = async (config, client, influx, vote, message) => {
    var embedFields = extra.fieldGenerator(message.cleanContent, 'Message')
    console.log(embedFields)
    client.channels.get(config.logchannel).send({embed: {
        color: config.colors.red,
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL
        },
        url: extra.urlGenerator(message),
        title: 'Message ID#' + message.id + ' deleted in #' + message.channel.name,
        description: 'The following message was deleted:',
        fields: embedFields,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL,
            text: 'User ID: ' + message.author.id
        }

    }})
}
