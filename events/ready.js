// ready.js

module.exports = async (config, client, vote, influx) => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
    client.user.setActivity('type +help')
}
