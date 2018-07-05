//message.js

var checkusers = {};

module.exports = async (config, client, influx, message) => {

    if (message.author.bot) {
        return;
    }

    if (message.channel.id == config.supportchannel) {
        influx.query("SELECT last(join) FROM message WHERE \"id\"=\'" + message.author.id + "\' fill(0)").then(results => {
            joindate = results[0].last;
            currdate = new Date();
            currdatesec = Math.round(currdate / 1000);
            sincejoin = Math.round(currdatesec - joindate);
            if (sincejoin < 600 ) { 
                minutes = Math.floor(sincejoin / 60);
                seconds = sincejoin - minutes * 60;
                client.channels.get(config.homechannel).send("inb4 " + message.author.toString() + " posts in support " + minutes + " minutes and " + seconds + " seconds after joining the server.");
                influx.writePoints([
                    {       
                        measurement: 'message',
                        tags: { id: message.author.id },
                        fields: { join: '0' },
                    }
                ]);
            }
        });
    }

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
    if (/^(o|O)+(o|O)(f|F)$/.test(message.cleanContent.split(" "))) {
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
            message.channel.send(loadplugins(), {"split":true});
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
                    // the *entire* stdout and stderr (buffered);
                    m.edit(stdout);


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
                    m.edit(stdout);


                });
            }
            break;
        }
        case 'ping': {
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
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
        default: {
            if (plugins.hasOwnProperty(command)) {
                if (plugins[command].nsfw && !message.channel.nsfw) {
                    message.channel.send('Tisk tisk, '.join( message.author.username, ". Don't be naughty here."))
                    break;
                }
                arg.shift();
                arg.shift();
                arg.unshift(message.author.id);
                const { execFile } = require('child_process');
                const child = execFile(plugins[command].path, arg,(error, stdout, stderr) => {
                    if (error) {
                        throw error;
                    }
                    message.channel.send(stdout, {"split":true});
                });
                if (plugins[command].delete) {
                    message.delete();
                }
            } else {
                message.channel.send("Discord's best practices for bots state that failed commands should fail silently");
            }
        }
    };
    if (message.guild.id.toString().includes(config.logserver)) {
        embedFields = fieldGenerator(message.cleanContent, "Command");
        console.log(embedFields)
        client.channels.get(config.logchannel).send({embed:{
            color: config.colors.green,
            author: {
                name : message.author.username,
                icon_url: message.author.displayAvatarURL
            },
            url: urlGenerator(message),
            title: "Command ran in #" + message.channel.name,
            fields: embedFields,
            timestamp: new Date(),
            footer: {
                icon_url: client.user.displayAvatarURL,
                text: "User ID: " + message.author.id,
            }
        }})
    }

}

const embedLength = 1020;

function lengthSplit (message, length) {
    splitCount = Math.floor( message.length / length) + 1;
    splits = [];

    for (n = 0; n < splitCount; n++) {
        splits.push(message.substr(0+(n*length), length));
    }
    
    if (!splits[splits.length-1]) {
        splits.pop();
    }
    console.log(splits)
    return splits;
};

function fieldGenerator (message, msgTitle) {
    console.log(msgTitle)
    console.log(message)
    splits = lengthSplit(message, embedLength);
    fields = [];
    if (splits.length = 1) {
        fields = [{
            name : msgTitle,
            value : "` " + splits[0] + " `" 
        }];
    } else {
        for (n = 0; n < splits.length; n++) {
            fields.push({
                name : msgTitle + " (" + n + ")",
                value : "` " + splits[n] + " `"
            })
        }
    }
    console.log(fields)
    return fields;
};

function urlGenerator (msgObj) {
url = "https://discordapp.com/channels/" + msgObj.guild.id + "/" + msgObj.channel.id + "/" + msgObj.id
return url
}