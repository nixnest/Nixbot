// Load up the discord.js library
const Discord = require('discord.js')
const fs = require('fs')
const _ = require('underscore')
const client = new Discord.Client()
const config = require ('./config.json')
const plotly = require('plotly')(config.plotlyuser, config.plotlykey)
const gotkicked = require('./gotkicked.json')
const joinmessages = require('./joinmessages.json')
const stream = require('stream')
// Since the events are moved to seperate files, need to smuggle these in through the config argument
config.colors = {
    red: 0x781706,
    orange: 0xBA430D,
    green: 0x037800
}
config.gotkicked = gotkicked
config.joinmessages = joinmessages
function loadEvents () {
    fs.readdir('./events/', (err, files) => {
        if (err) {
            return 'Failed to load Events'
        } else {
            files.forEach(file => {
                const name = file.split('.')[0]
                const event = require(`./events/${file}`)
                client.on(name, event.bind(null, config, client, influx))
                console.log(`Loading Event: ${name}`)
            })
        }
    })
}

config.loadplugins = loadplugins()

function loadplugins () {
    var pluginsfile = fs.readFileSync('./plugins/plugins.json')
    config.plugins = JSON.parse(pluginsfile)
    console.log('Reloaded plugins. Current plugins:\n\n`' + Object.keys(config.plugins) + '`')
}
var Influx = require('influx')
var influx = new Influx.InfluxDB({
    host: 'oort.zwater.us:8086',
    database: 'nixnest',
    schema: [
        {
            measurement: 'message',
            fields: {
                value: Influx.FieldType.FLOAT,
                manual: Influx.FieldType.FLOAT,
                join: Influx.FieldType.FLOAT
            },
            tags: [
                'id'
            ]
        }
    ]

})
function getStats() {
    console.log('Grabbing new stats, generating graphs');
    const { execFile } = require('child_process')
    execFile('./leaderboard.py', null, (error, stdout, stderr) => {
        if (error) {
            throw error
        }
        var leaders = JSON.parse(stdout)
        //console.log(leaders);
        //console.log(client.guilds);
        //logGuild = _.find(client.guilds, function(guild) {return guild.id == config.logserver; });
        //console.log(config.logserver);
        //console.log(client.guilds);
        var logGuild = client.guilds.find('id', config.logserver);
        var users = [];
        var counts = [];
        //console.log(logGuild);
        for (var entry in leaders) {
            if (logGuild.members.find('id', leaders[entry].id)) {
                users[entry] = logGuild.members.find('id', leaders[entry].id).displayName;
                counts[entry] = leaders[entry].count;
                leaders[entry].id = (logGuild.members.find('id', leaders[entry].id).displayName);
            } else {
                users[entry] = '<notfound-' + entry + '>';
                counts[entry] = leaders[entry].count;
                leaders[entry].id = ('<notfound>')
            }

        }
        plotData = [
            {
                x: users,
                y: counts,
                type: "bar",
                mode: "markers+text"
            }
        ];
        var layoutopts = {
            title: "Top Posters, Last 7 days"
        }

        var figure = { 'data': plotData };
        var graphOptions= {layout: layoutopts, format: "png", width: 1000, height: 500};

        plotly.getImage(figure, graphOptions, function (err, msg) {
            if (err) return console.log(err);
            var output = fs.createWriteStream('leaderboard.png');
            msg.pipe(output);
        });
        //console.log(leaders);
        //console.log(users);
        //console.log(counts);


        //console.log(leaders[1].id);
        //console.log(logGuild.members.find('id', leaders[1].id).displayName);

    })

}

setInterval(getStats, 3600000);

loadEvents()
loadplugins()

client.login(config.token)
