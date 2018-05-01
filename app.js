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
    console.log(plugins);
    return("Reloaded plugins. Current plugins:\n\n`" + Object.keys(plugins) + "`");
}

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame(`type +help`);
    const guildsNum = `${client.guilds.size}`;
    const guilds = `${client.guilds.firstKey()}`;
    console.log(loadplugins());
});
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


var messages = [];
client.on("message", async message => {
    if (message.author.bot) return;
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


    //console.log(`message in channel: ${message.cleanContent}`);
    const arg = message.cleanContent.split(" ");
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
            message.channel.send("**Help**\n\n**+tldr <channel>: {** Returns emotions based on certain keywords in the last 100 messages in the channel (or the channel you specify. Optional)\n**+lmgtfy <query>: {** Returns a link to lmgtfy for being passive aggressive.\n**+echo <words>: {** duh.\n**+ping: {** Returns diagnostic latency data, makes sure the bot's running.\n**+wiki <query>: {** Searches the ArchWiki.\n**+ban: {** Returns a nice message\n\n**Plugins: {**\n\n`" + Object.keys(plugins) + "`");
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
            message.channel.send("https: {//lmgtfy.com/?q=" + query);
            message.delete();
            break;
        }
        case 'searx': {
            arg.shift();
            arg.shift();
            arg.join();
            var query = arg.toString().replace(/,/g, '%20');
            message.channel.send("https: {//searx.tadeo.ca/?q=" + query + "&categories=general");
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
            message.channel.send("https: {//wiki.archlinux.org/index.php?search=" + wiki);
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
                request('https: {//nekos.life/api/v2/img/' + neko, { json: true }, (err, res, body) => {
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
                message.channel.send(help.message + "`" + Object.keys(plugins) + "`");
            }
        }

    };
    // message.delete();
    if (message.guild.id.toString().includes(config.logserver)) {
        client.channels.get(config.logchannel).send( message.author.username + '(' + message.author.id + ') ran command `' + message.cleanContent + '` in ' + message.channel);
    }
});

client.login(config.token);
