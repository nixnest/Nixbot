// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const gotkicked = require("./gotkicked.json");
const help = require('./help.json');
fs = require('fs');
function loadplugins() {
    //fs = require('fs');
    pluginsfile = fs.readFileSync('./plugins/plugins.json');
    plugins = JSON.parse(pluginsfile);
    return("Reloaded plugins. Current plugins:\n\n`" + Object.keys(plugins) + "`");
}
async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame(`type +help`);
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
            },
            tags: [
                'id'
            ]
        }
    ]

});
var checkusers = {};
var copypastafile = require(config.copypastajson);
var copypasta = JSON.parse(JSON.stringify(copypastafile));
console.log("copypasta file parsed")
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    //complain to just the devs
    client.channels.get(config.sasschannel).send(gotkicked.message[Math.ceil(Math.random() * gotkicked.messages.length)]);

});
//var pluginfs = require('fs');
//var pluginfiles = pluginfs.readdirSync('./plugins');
//console.log(pluginfiles);

client.on("guildMemberAdd", async member => {
    member.send("Welcome, remember that support goes in #support not #home");
});

var messages = [];
client.on("message", async message => {
    if (message.author.bot) {
        return;
    }
    if (messages.length > 99) {
        messages.shift();
        messages.push(message.cleanContent);
    } else {
        messages.push(message.cleanContent);
    }
    //  var zmentions = message.mentions.users.findAll('id', '124615648482426880');
    //	if (zmentions != null &&  zmentions.length > 0) {
    //        	console.log("Somebody mentioned you");
    //		const { execFile } = require('child_process');
    //		const child = execFile('/home/zack/dbot/lights.sh', ['blink'],(error, stdout, stderr) => {
    //  		if (error) {
    //    			throw error;
    //    			}
    //console.log(stdout);
    //	});

    //	}


    //console.log(`message in channel: ${message.cleanContent}`)
    //console.log(message.guild.roles);
    if (message.guild.id.toString().includes(config.logserver)) {
        influx.writePoints([
            {
                measurement: 'message',
                tags: { id: message.author.id },
                fields: { value: '1'},
            }
        ]);

        if (checkusers[message.author.id] == null) {
            checkusers[message.author.id] = 0;
        }
        checkusers[message.author.id] += 1;
        //console.log(checkusers);
        if (checkusers[message.author.id] % 10 == 0) {
            console.log("checking " + message.author.id);
            influx.query("SELECT SUM(value) + SUM(manual) FROM message WHERE \"id\"=\'" + message.author.id + "\' fill(0)").then(results => {
                newcount = results[0].sum_sum;
                if (newcount > 500) {
                    message.member.addRole(config.msgs_500[0]);
                }
                if (newcount > 1000) {
                    message.member.addRole(config.msgs_1000[0]);
                }
                if (newcount > 2500) {
                    message.member.addRole(config.msgs_2500[0]);
                }
                if (newcount > 5000) {
                    message.member.addRole(config.msgs_5000[0]);
                }
                if (newcount > 10000) {
                    message.member.addRole(config.msgs_10000[0]);
                }
                if (newcount > 25000) {
                    message.member.addRole(config.msgs_25000[0]);
                }
                if (newcount > 50000) {
                    message.member.addRole(config.msgs_50000[0])
                }
            })
            checkusers[message.author.id] = 0;
        }
    }
    const arg = message.cleanContent.split(" ");
    if (/^o+of$/.test(message.cleanContent.split(" "))) {
        message.channel.send({
            files: ['https://cdn.discordapp.com/attachments/437302483044401152/446047008147374091/Roblox_Death_Sound_Effect.mp3']
         });
        if (message.member.voiceChannelID) {
            //console.log(message.member.voiceChannel);
            message.member.voiceChannel.join()
            .then(connection => {
                const dispatcher = connection.playFile('./oof.mp3');
                
            })
            await sleep(3000);
            message.member.voiceChannel.leave();
            //message.member.voiceChannel.leave();
            

    }
    }
    arg.unshift(message.channel);
    const { execFile } = require('child_process');
    const child = execFile('./log.sh', arg,(error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        //console.log(stdout);
    });
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    switch(command) {
        case '🅱an' : {
            message.channel.send("__**:b:USER WAS :b:ANNED FOR THIS :b:OST**__");
            message.delete();
            break;
        }
        case 'setmsgs': {
            mentions = message.mentions.users.array();
            target = mentions[0].id;
            //var filterarg = arg.filter(function(e) { return e !== message.mentions.users.username})
            arg.shift();
            arg.shift();
            var newmsg = arg[arg.length -1].toString();
            if (message.member.roles.find('id', config.modrole)) {
                if (isNaN(newmsg)) {
                    message.channel.send("Provided message cound `" + newmsg + "` does not appear to be a number. Try again.");
                } else {
                    influx.dropSeries({
                        measurement: m => m.name('message'),
                        where: e => e.tag('id').equals.value(target),
                        database: 'nixnest'
                    });
                    message.channel.send("Setting messages for user");
                    await sleep(2000);
                    influx.writePoints([
                        {
                            measurement: 'message',
                            tags: { id: target },
                            fields: { manual: newmsg },
                        }
                    ]);



                }
            } else {
                message.channel.send(message.author.username + " is not in the sudoers file. This incident will be reported.");
            }
            break;
        }
        case 'messages': {
            influx.query("SELECT SUM(manual) FROM message WHERE \"id\"=\'" + message.author.id + "\' fill(0)").then(manresults => {
                if (manresults[0] !== undefined) {
                    message.channel.send("You have already set your messages.");

                } else {
                    arg.shift();
                    arg.shift();
                    arg.join();
                    var newmsg = arg.toString();
                    //message.channel.send("Setting your messages to " + newmsg + ". **You cannot do this again**");
                    //console.log(message.member.roles.array());
                    if (isNaN(newmsg)) {
                        message.channel.send("Provided message count `" + newmsg + "` does not appear to be a number. Try again.");
                    } else if (newmsg < 500 && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_500[0]) && newmsg < config.msgs_1000[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_1000[0]) && newmsg < config.msgs_2500[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_2500[0]) && newmsg < config.msgs_5000[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_5000[0]) && newmsg < config.msgs_10000[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_10000[0]) && newmsg < config.msgs_25000[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else if (message.member.roles.find('id', config.msgs_25000[0]) && newmsg < config.msgs_50000[1] && newmsg > 0) {
                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg},
                            }
                        ]);
                        message.channel.send("Setting your message count in the database to " + newmsg + ". **You cannot do this again. If you screwed it up, Ping ZackW**");
                    } else { message.channel.send("That number is too high for your current role. Cheater.");}
                }
            });
            break;
        }

        case 'reload': {
            message.channel.send(loadplugins());
            break;
        }
        case 'tldr': {
            const m = await message.channel.send("Working on it...");
            if (message.mentions.channels.array().join() == "") {
                const { execFile } = require('child_process');
                const arg = [message.channel]
                const child = execFile('./emote.sh', arg, (err, stdout, stderr) => {
                    if (err) {
                        // node couldn't execute the command
                        return;
                    }
                    // the *entire* stdout and stderr (buffered)
                    //console.log(`stdout: { ${stdout}`);
                    m.edit(stdout);
                    //console.log(`stderr: { ${stderr}`);

                });
            } else {
                const { execFile } = require('child_process');
                const arg = [message.mentions.channels.array()];
                arg.unshift('custchannel');
                const child = execFile('./emote.sh', arg, (err, stdout, stderr) => {
                    if (err) {
                        // node couldn't execute the command
                        return;
                    }
                    // the *entire* stdout and stderr (buffered)
                    //console.log(`stdout: { ${stdout}`);
                    m.edit(stdout);
                    //console.log(`stderr: { ${stderr}`);

                });
            }
            break;
        }
        case 'help': {
            message.channel.send(help.message + "`" + Object.keys(plugins) + "`");
            //message.channel.send("**Help**\n\n**+tldr <channel>: {** Returns emotions based on certain keywords in the last 100 messages in the channel (or the channel you specify. Optional)\n**+lmgtfy <query>: {** Returns a link to lmgtfy for being passive aggressive.\n**+echo <words>: {** duh.\n**+ping: {** Returns diagnostic latency data, makes sure the bot's running.\n**+wiki <query>: {** Searches the ArchWiki.\n**+ban: {** Returns a nice message\n\n**Plugins: {**\n\n`" + Object.keys(plugins) + "`");
            break;
        }
        case 'ping': {
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
            break;
        }
        case 'lmgtfy': {
            arg.shift();
            arg.shift();
            arg.join();
            var query = arg.toString().replace(/,/g, '+');
            message.channel.send("https://lmgtfy.com/?q=" + query);
            message.delete();
            break;
        }
        case 'searx': {
            arg.shift();
            arg.shift();
            arg.join();
            var query = arg.toString().replace(/,/g, '%20');
            message.channel.send("https://searx.tadeo.ca/?q=" + query + "&categories=general");
            message.delete();
            break;
        }
        case 'echo': {
            arg.shift();
            arg.shift();
            arg.join();
            var echo = arg.toString().replace(/,/g, ' ');
            message.channel.send(echo);
            message.delete()
            break;
        }
        case 'wiki': {
            arg.shift();
            arg.shift();
            arg.join();
            var wiki = arg.toString().replace(/,/g, '+');
            message.channel.send("https://wiki.archlinux.org/index.php?search=" + wiki);
            message.delete();
            break;
        }
        case 'ban': {
            message.channel.send("__**USER WAS BANNED FOR THIS POST**__");
            message.delete();
            break;
        }
        case 'c': {
            arg.shift();
            arg.shift();
            arg.join(' ');
            var pasta = arg.toString();
            // console.log(pasta);
            if(copypasta.hasOwnProperty(pasta)){
                message.channel.send(copypasta[pasta]);
            } else {
                message.channel.send('`' + pasta + "`: { Not found\nCurrent available copypasta are: {\n`" + Object.keys(copypasta).join(', ') + '`');
            }
            break;
        }
        case 'neko': {
            if(message.channel.nsfw) {
                arg.shift();
                arg.shift();
                arg.join();
                var neko = arg.toString();
                const request = require('request');
                request('https://nekos.life/api/v2/img/' + neko, { json: true }, (err, res, body) => {
                    if (err) {
                        return console.log(err);
                    }
                    if (body.url) {
                        message.channel.send(body.url);
                    } else {
                        message.channel.send("`" + neko + "`: { Not found. Options are: {\n```'cum', 'les', 'meow', 'tickle', 'lewd', 'feed', 'bj', 'nsfw_neko_gif', 'nsfw_avatar', 'poke', 'anal', 'slap', 'avatar', 'pussy', 'lizard', 'classic', 'kuni', 'pat', 'kiss', 'neko', 'cuddle', 'fox_girl', 'boobs', 'Random_hentai_gif', 'hug'```");
                    }
                });
            } else {
                message.channel.send("This channel must be marked NSFW");
            }
            break;
        }
        default: {
            if (plugins.hasOwnProperty(command)) {
                arg.shift();
                arg.shift();
                //console.log(command + ' is in plugins');
                const { execFile } = require('child_process');
                const child = execFile(plugins[command][0], arg,(error, stdout, stderr) => {
                    if (error) {
                        throw error;
                    }
                    message.channel.send(stdout);
                });
                if (plugins[command][1] === "1") {
                    message.delete();
                }
            } else {
                //message.channel.send(help.message + "`" + Object.keys(plugins) + "`");
                message.channel.send("Discord's best practices for bots state that failed commands should fail silently");
            }
        }

    };
    // message.delete();
    if (message.guild.id.toString().includes(config.logserver)) {
        client.channels.get(config.logchannel).send( message.author.username + '(' + message.author.id + ') ran command `' + message.cleanContent + '` in ' + message.channel);
    }
});

client.login(config.token);
