// Load up the discord.js library
const Discord = require("discord.js");
fs = require('fs');

const client = new Discord.Client();

const config = require("./config.json");
const gotkicked = require("./gotkicked.json");
const joinmessages = require("./joinmessages.json");
const extra = require("./modules/extraneous.js")

config.colors = {
    red: 0x781706,
    orange: 0xBA430D,
    green: 0x037800
}

// Since the events are moved to seperate files, need to smuggle these in through the config argument
config.gotkicked = gotkicked
config.joinmessages = joinmessages

function loadEvents() {
    fs.readdir("./events/", (err, files) => {
        files.forEach( file => {
            const name = file.split('.')[0]
            const event = require('./events/'+file);
            client.on(name, event.bind(null, config, client, influx));
        })
    });
    
}

function loadplugins() {
    pluginsfile = fs.readFileSync('./plugins/plugins.json');
    plugins = JSON.parse(pluginsfile);
    return("Reloaded plugins. Current plugins:\n\n`" + Object.keys(plugins) + "`");
}
async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setActivity('type +help');
    const guildsNum = `${client.guilds.size}`;
    const guilds = `${client.guilds.firstKey()}`;
    console.log(loadplugins());

});
var Influx = require('influx');
var influx = new Influx.InfluxDB({
    host: 'oort.zwater.us:8086',
    database: 'nixnest',
    schema: [
        {
            measurement: 'message',
            fields: {
                value: Influx.FieldType.FLOAT,
                manual: Influx.FieldType.FLOAT,
                join: Influx.FieldType.FLOAT,
            },
            tags: [
                'id'
            ]
        }
    ]

});
/*
var guildCreate = require("./events/guildCreate.js");

client.on("guildCreate", guildCreate.bind(null, config, client, influx));

var guildDelete = require("./events/guildDelete.js");

client.on("guildDelete", guildDelete.bind(null, config, client, influx));

var guildMemberAdd = require("./events/guildMemberAdd.js")

client.on("guildMemberAdd", guildMemberAdd.bind(null, config, client, influx));

var message = require("./events/message.js");

client.on("message", message.bind(null, config, client, influx));

var messageDelete = require("./events/messageDelete.js");

client.on("messageDelete", messageDelete.bind(null, config, client, influx));

var messageUpdate = require("./events/messageUpdate.js");

client.on("messageUpdate", messageUpdate.bind(null, config, client, influx));
*/

loadEvents();

client.login(config.token);

