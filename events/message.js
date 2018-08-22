// message.js

const extra = require('./../modules/extraneous')
const request = require('request');
var checkusers = {}
var messages = []
//var vote = []
var lastimage = {};
var casprocessing = false
function leaderboard(users, counts) {
    var num = Object.keys(users).length
    num--;
    var x = 0
    var leaderboard = ""
    while (x <= num) {
        if ( x == 0) {
            leaderboard = leaderboard + '__**' + (x + 1) + '. ' + users[x] + ', ' + counts [x] + ' messages**__' + '\n'
        } else {
            leaderboard = leaderboard + '**' + (x + 1) + '.** *' + users[x] + '*, ' + counts[x] + ' messages' + '\n'
        }
        x++;
    }
    return leaderboard
}
module.exports = async (config, client, influx, vote, message) => {
    if (message.author.bot) return
    if (message.member.roles.find('id', config.botbannedrole) && !message.member.roles.find("id", config.modrole)) return
    if (message.channel.toString().includes('436660589616431106')) {
        message.delete()
    }
    if (messages.length > 99) {
        messages.shift()
        messages.push(message.cleanContent)
    } else {
        messages.push(message.cleanContent)
    }

    if (message.channel.id === config.supportchannel) {
        influx.query('SELECT last(join) FROM message WHERE \"id\"=\'' + message.author.id + '\' fill(0)').then(results => {
            var joindate = results[0].last
            var currdate = new Date()
            var currdatesec = Math.round(currdate / 1000)
            var sincejoin = Math.round(currdatesec - joindate)
            if (sincejoin < 600) {
                var minutes = Math.floor(sincejoin / 60)
                var seconds = sincejoin - minutes * 60
                client.channels.get(config.homechannel).send(`inb4 ${message.author.toString()} posts in support ${minutes} minutes and ${seconds} seconds after joining the server.`)
                influx.writePoints([
                    {
                        measurement: 'message',
                        tags: { id: message.author.id },
                        fields: { join: '0' }
                    }
                ])
            }
        })
    }

    if (message.guild.id.toString().includes(config.logserver)) {
        influx.writePoints([
            {
                measurement: 'message',
                tags: { id: message.author.id },
                fields: {value: '1'}
            }
        ])

        if (checkusers[message.author.id] == null) {
            checkusers[message.author.id] = 0
        }
        checkusers[message.author.id] += 1
        if (config.msgs_500 && checkusers[message.author.id] % 10 === 0) {
            console.log('checking ' + message.author.id)
            influx.query('SELECT SUM(value) + SUM(manual) FROM message WHERE \"id\"=\'' + message.author.id + '\' fill(0)').then(results => {
                console.log(results[0]);
                var newcount = results[0].sum_sum
                if (newcount > 500) {
                    message.member.addRole(config.msgs_500[0])
                }
                if (newcount > 1000) {
                    message.member.addRole(config.msgs_1000[0])
                }
                if (newcount > 2500) {
                    message.member.addRole(config.msgs_2500[0])
                }
                if (newcount > 5000) {
                    message.member.addRole(config.msgs_5000[0])
                }
                if (newcount > 10000) {
                    message.member.addRole(config.msgs_10000[0])
                }
                if (newcount > 25000) {
                    message.member.addRole(config.msgs_25000[0])
                }
                if (newcount > 50000) {
                    message.member.addRole(config.msgs_50000[0])
                }
            })
            checkusers[message.author.id] = 0
        }
    }
    const arg = message.cleanContent.split(' ')

    // If message is only some form of "oof" then send the oof file
    if (/^(o+of)$/ig.test(message.cleanContent)) {
        var rand = Math.floor(Math.random() * Math.floor(100));
        if (rand >= 66) {

            message.channel.send({
                files: ['https://cdn.discordapp.com/attachments/437302483044401152/446047008147374091/Roblox_Death_Sound_Effect.mp3']
            })
            if (message.member.voiceChannelID) {
                console.log('Connecting to voice channel')
                message.member.voiceChannel.join()
                    .then(connection => {
                        connection.playFile('./Roblox_Death_Sound_Effect.mp3')
                    })
                await extra.sleep(3000)
                console.log('Disconnecting from voice channel')
                message.member.voiceChannel.leave()
            }
        }
    }

    // If message is only some for of "bidoof then send the bidoof file
    if (/^(bido+of)$/ig.test(message.cleanContent)) {
        message.channel.send({
            files: ['https://cdn.discordapp.com/attachments/460892286423793696/464497037283688469/bidoof.png']
        })
    }

    //console.log(message.attachments.size);
    //console.log(message.id);
    if (/^.*http.*\.(png|jpg|jpeg)/ig.test(message.cleanContent))  {
        var data = message.cleanContent;
    } else if (message.attachments.size == 1) {
        if (/^.*http.*\.(png|jpg|jpeg)/ig.test(message.attachments.array()[0].url)) {
            var data = message.attachments.array()[0].url;
        }
    }
    if (data) {
        //const m = await message.channel.send('detected image link. Analyzing')
        var imgre = /http.*\.(png|jpg|jpeg)/ig;
        var r = data.match(imgre);
        console.log('scanning image url ' + r);
        if (!message.channel.nsfw) {
            request('https://nsfw.haschek.at/api.php?url=' + r, { json: true }, (err, res, body) => {
                //console.log(body)
                if (err) {
                    return console.log(err);
                }
                lastimage[message.channel.id] = {};
                lastimage[message.channel.id]["url"] = r
                lastimage[message.channel.id]["score"] = body.porn_probability
                //console.log(lastimage);
                if (body.porn_probability) {
                    if (body.porn_probability > 90) {
                        message.channel.send('This is _probably_ porn(' + body.porn_probability + '%). React up on the image to delete it. Needs 5 votes');
                        message.react('⬆');
                        vote[message.id] = 0
                    } else  if (message.channel.id == "124648453652480003") {
                        message.react('✔');
                    }
                }
            });
        }
    }
    if (/.*install gentoo.*/ig.test(message.cleanContent)) {
        var rand = Math.floor(Math.random() * Math.floor(100));
        if (rand >= 95) {
            //var gentoo = new RegExp('/install gentoo/ig');
            //var r = message.cleanContent.toString().match(gentoo);
            var oslist = ["Windows", "Arch", "Ubuntu", "Mint", "Void", "OpenBSD", "FreeBSD", "NetBSD", "Solus", "Android", "MacOS", "TempleOS", "Alpine"]
            var randInt = Math.floor(Math.random() * Math.floor(oslist.length - 1));
            r = message.cleanContent.replace(/(install gentoo)/ig, 'install ' + oslist[randInt]);
            message.delete();
            message.channel.send('**' + message.author.username + ':** ' + r);
        }
    }


    arg.unshift(message.channel)
    const { execFile } = require('child_process')
    execFile('./log.sh', arg, (error, stdout, stderr) => {
        if (error) {
            throw error
        }
    })
    if (message.content.indexOf(config.prefix) !== 0) return

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    switch (command) {
        case 'cas' : {
            if (casprocessing == false) {
                if (/^.*http.*\.(png|jpg|jpeg)/ig.test(message.cleanContent))  {
                    message.delete();
                    const m = await message.channel.send('Processing. Hold on a minute.');
                    console.log('found a URL');
                    arg.shift();

                    arg.shift();
                    var url = arg.toString();
                    var casargs = [url,'1','1'];
                    console.log(casargs)
                    const { execFile } = require('child_process')
                    casprocessing = true
                    execFile('./ContentAware.sh', casargs, (error, stdout, stderr) => {
                        console.log(stderr);
                        if (stderr) {
                            casprocessing = false
                        }
                        if (error) {
                            casprocessing = false
                            throw error
                        }
                        if (stdout) {
                            casprocessing = false
                            m.delete();
                            message.channel.send({
                                files: [{
                                    attachment: './CAS_OUTPUT.jpg',
                                    name: 'CAS_OUTPUT.jpg'
                                }]
                            })
                        }
                    });
                } else {
                    const m = await message.channel.send('Processing the most recently posted image. Hold on a minute.');
                    var casargs = [lastimage[message.channel.id]["url"], '1', '1']
                    casprocessing = true
                    const { execFile } = require('child_process')
                    execFile('./ContentAware.sh', casargs, (error, stdout, stderr) => {
                        console.log(stderr);
                        if (stderr) {
                            casprocessing = false
                        }
                        if (error) {
                            casprocessing = false
                            throw error
                        }
                        if (stdout) {
                            m.delete();
                            casprocessing = false
                            message.channel.send('Using most recently posted image.', {
                                files: [{
                                    attachment: './CAS_OUTPUT.jpg',
                                    name: 'CAS_OUTPUT.jpg'
                                }]
                            })
                        }
                    });
                }
            } else {
                message.channel.send('Still processing. Wait a minute.');
            }
            break;
        }
        case 'isthisporn': {
            if (message.channel.nsfw) {
                message.channel.send("This command does not work in NSFW channels. It's safe to assume the last image posted was porn");
            } else if (message.member.roles.find("id", config.modrole) || message.channel.id == "124648453652480003") {
                message.channel.send("URL to the last image posted: `" + lastimage[message.channel.id]["url"] + "`\nScore: **" + lastimage[message.channel.id]["score"] + "%**");
            }
            break;
        }

        case 'leaderboard': {
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
                message.channel.send('**Top posters, last 7 days:**\n' + leaderboard(users, counts));
                //message.channel.send(counts);
                //message.channel.send({
                //    files: [{
                //        attachment: 'leaderboard.png',
                //        name: 'current_leaderboard.png'
                //    }]
                //})
            });
            break
        }
        case 'realban': {
            //console.log(message.mentions.users.array().length);
            if (message.mentions.users.array().length == 1) {
                //console.log(message.mentions);
                var mentions = message.mentions.users.array()
                //console.log("using mention");
                console.log(mentions);
                var target = message.guild.members.find('id', mentions[0].id)
            } else {
                arg.shift();
                arg.shift();
                var potential = arg.toString();
                if (message.guild.members.find('id', potential)) {
                    var target = message.guild.members.find('id', potential);
                } else {
                    message.channel.send("No user by that ID. Sorry.");
                }
            }
            if (target && message.member.roles.find('id', config.modrole)) {
                message.channel.send("banning" + target);
                target.ban()
            } else {
                message.channel.send('Something has gone wrong. Either there\'s been an error, or, more likely, you aren\'t a moderator')
            }


            break;
        }
        case 'setmsgs': {
            if (!config.msgs_500) return;
            var mentions = message.mentions.users.array()
            var target = mentions[0].id
            arg.shift()
            arg.shift()
            var newmsg = arg[arg.length - 1].toString()
            if (message.member.roles.find('id', config.modrole)) {
                if (isNaN(newmsg)) {
                    message.channel.send('Provided message cound `' + newmsg + '` does not appear to be a number. Try again.')
                } else {
                    influx.dropSeries({
                        measurement: m => m.name('message'),
                        where: e => e.tag('id').equals.value(target),
                        database: 'nixnest'
                    })
                    message.channel.send('Setting messages for user')
                    await extra.sleep(2000)
                    influx.writePoints([
                        {
                            measurement: 'message',
                            tags: { id: target },
                            fields: { manual: newmsg }
                        }
                    ])
                }
            } else {i
                message.channel.send(message.author.username + ' is not in the sudoers file. This incident will be reported.')
            }
            break
        }
        case 'messages': {
            if (!config.msgs_500) return;
            influx.query('SELECT SUM(manual) FROM message WHERE \"id\"=\'' + message.author.id + '\' fill(0)').then(async manresults => {
                console.log(manresults);
                if (manresults[0] !== undefined) {
                    message.channel.send('You have already set your messages.')
                } else {
                    arg.shift()
                    arg.shift()
                    arg.join()
                    var newmsg = arg.toString()

                    if (isNaN(newmsg)) {
                        message.channel.send('Provided message count `' + newmsg + '` does not appear to be a number. Try again.')
                    } else if (newmsg < 500 && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_500[0]) && newmsg < config.msgs_1000[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_1000[0]) && newmsg < config.msgs_2500[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_2500[0]) && newmsg < config.msgs_5000[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_5000[0]) && newmsg < config.msgs_10000[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_10000[0]) && newmsg < config.msgs_25000[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else if (message.member.roles.find('id', config.msgs_25000[0]) && newmsg < config.msgs_50000[1] && newmsg > 0) {
                        influx.dropSeries({
                            measurement: m => m.name('message'),
                            where: e => e.tag('id').equals.value(message.author.id),
                            database: 'nixnest'
                        })
                        await extra.sleep(2000)

                        influx.writePoints([
                            {
                                measurement: 'message',
                                tags: { id: message.author.id },
                                fields: { manual: newmsg }
                            }
                        ])
                        message.channel.send('Setting your message count in the database to ' + newmsg + '. **You cannot do this again. If you screwed it up, Ping ZackW**')
                    } else { message.channel.send('That number is too high for your current role. Cheater.') }
                }
            })
            break
        }
        case 'reload': {
            message.channel.send(config.loadplugins(), {'split': true})
            break
        }
        case 'tldr': {
            const m = await message.channel.send('Working on it...')
            if (message.mentions.channels.array().join() === '') {
                const { execFile } = require('child_process')
                const arg = [message.channel]
                execFile('./emote.sh', arg, (err, stdout, stderr) => {
                    if (err) {
                        // Node couldn't execute the command
                        return
                    }
                    // The *entire* stdout and stderr (buffered);
                    m.edit(stdout)
                })
            } else {
                const { execFile } = require('child_process')
                const arg = [message.mentions.channels.array()]
                arg.unshift('custchannel')
                execFile('./emote.sh', arg, (err, stdout, stderr) => {
                    if (err) {
                        // Node couldn't execute the command
                        return
                    }
                    // The *entire* stdout and stderr (buffered)
                    m.edit(stdout)
                })
            }
            break
        }
        case 'ping': {
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m = await message.channel.send('Ping?')
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`)
            break
        }
        case 'echo': {
            arg.shift()
            arg.shift()
            arg.join()
            var echo = arg.toString().replace(/,/g, ' ')
            message.channel.send(echo)
            message.delete()
            break
        }
        case 'literally-ban-me': {
            message.member.ban('Literally banned themselves');
            message.channel.send('Done. Buh-bye forever!');
            break
        }
        case 'literally-kick-me': {
            message.member.kick('Literally kicked themselves');
            message.channel.send('Done. Buh-bye!');
            break
        }
        default: {
            if (config.plugins.hasOwnProperty(command)) {
                if (config.plugins[command].nsfw && !message.channel.nsfw) {
                    message.channel.send('Tisk tisk, '.join(message.author.username), '. Don\'t be naughty here.')
                    break
                }
                var argb = message.content.split(' ')
                argb.shift()
                argb.unshift(message.author.id)
                const { execFile } = require('child_process')
                execFile(config.plugins[command].path, argb, (error, stdout, stderr) => {
                    if (error) {
                        throw error
                    }
                    message.channel.send(stdout, {'split': true})
                })
                if (config.plugins[command].delete) {
                    message.delete()
                }
            } else {
                message.channel.send('Discord\'s best practices for bots state that failed commands should fail silently')
            }
        }
    };

    var embedFields = extra.fieldGenerator(message.cleanContent, 'Command')
    console.log(embedFields)
    client.channels.get(config.logchannel).send({embed: {
        color: config.colors.green,
        author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL
        },
        url: extra.urlGenerator(message),
        title: 'Command ran in #' + message.channel.name,
        fields: embedFields,
        timestamp: new Date(),
        footer: {
            icon_url: client.user.displayAvatarURL,
            text: 'User ID: ' + message.author.id
        }
    }})
}
