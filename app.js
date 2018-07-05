// Load up the discord.js library
const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client()

const config = require('./config.json')
const gotkicked = require('./gotkicked.json')
const joinmessages = require('./joinmessages.json')

config.colors = {
    red: 0x781706,
    orange: 0xBA430D,
    green: 0x037800
}

// Since the events are moved to seperate files, need to smuggle these in through the config argument
config.gotkicked = gotkicked
config.joinmessages = joinmessages

function loadEvents () {
    var log = 'Loading Events:\n'
    fs.readdir('./events/', (err, files) => {
        if (err) {
            log = 'Failed to load Events'
            return log
        } else {
            files.forEach(file => {
                const name = file.split('.')[0]
                const event = require(`./events/${file}`)
                client.on(name, event.bind(null, config, client, influx))
                log += file + '\n'
            })
        }
    })
    log += 'Events Loaded'
    return log
}

config.loadplugins = loadplugins()

function loadplugins () {
    var pluginsfile = fs.readFileSync('./plugins/plugins.json')
    config.plugins = JSON.parse(pluginsfile)
    return ('Reloaded plugins. Current plugins:\n\n`' + Object.keys(config.plugins) + '`')
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

console.log(loadEvents())
console.log(loadplugins())

client.login(config.token)
