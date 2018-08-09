// guildMemberAdd.js

module.exports = async (config, client, influx, vote, member) => {
    var timestamp = new Date()
    var seconds = Math.round(timestamp / 1000)
    console.log('new join at ' + seconds);
    influx.writePoints([
        {
            measurement: 'message',
            tags: { id: member.id },
            fields: { join: seconds }
        }
    ])
    if (member.guild.id === config.logserver) {
        var message = config.joinmessages.messages[Math.ceil(Math.random() * config.joinmessages.messages.length)]
        var finalmessage = message.replace(/\$n/g, member.user.toString())
        finalmessage = finalmessage.replace(/\$p/g, member.displayName.toString())
        client.channels.get(config.homechannel).send(finalmessage, {'split': true})
    }
}
