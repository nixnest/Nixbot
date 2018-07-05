// guildCreate.js

module.exports = async (config, client, influx, guild) => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
}
