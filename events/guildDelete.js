// guildDelete.js

module.exports = async (config, client, influx, guild) => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    //complain to just the devs
    client.channels.get(config.sasschannel).send(config.gotkicked.message[Math.ceil(Math.random() * config.gotkicked.messages.length)], {"split":true});
}