// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setGame(`type +help`);
    const guildsNum = `${client.guilds.size}`;
    const guilds = `${client.guilds.firstKey()}`;
    console.log(`Guilds: ${guilds}`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

var messages = [];
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.toString().includes("436660589616431106")) {
        message.delete();
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


    //console.log(`message in channel: ${message.cleanContent}`);
    const arg = message.cleanContent.split(" ");
    arg.unshift(message.channel);
    const { execFile } = require('child_process');
    const child = execFile('/home/zack/dbot/log.sh', arg,(error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        //console.log(stdout);
    });
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    if (command === "tldr") {
        const m = await message.channel.send("Working on it...");
        if (message.mentions.channels.array().join() == "") {
            const { execFile } = require('child_process');
            const arg = [message.channel]
            const child = execFile('/home/zack/dbot/emote.sh', arg, (err, stdout, stderr) => {
                if (err) {
                    // node couldn't execute the command
                    return;
                }
                // the *entire* stdout and stderr (buffered)
                //console.log(`stdout: ${stdout}`);
                m.edit(stdout);
                //console.log(`stderr: ${stderr}`);

            });
        } else {
            const { execFile } = require('child_process');
            const arg = [message.mentions.channels.array()];
            arg.unshift('custchannel');
            const child = execFile('/home/zack/dbot/emote.sh', arg, (err, stdout, stderr) => {
                if (err) {
                    // node couldn't execute the command
                    return;
                }
                // the *entire* stdout and stderr (buffered)
                //console.log(`stdout: ${stdout}`);
                m.edit(stdout);
                //console.log(`stderr: ${stderr}`);

            });
        }}
    if (command ==="help") {
        message.channel.send("**Help**\n\n**+tldr <channel>:** Returns emotions based on certain keywords in the last 100 messages in the channel (or the channel you specify. Optional)\n**+lmgtfy <query>:** Returns a link to lmgtfy for being passive aggressive.\n**+echo <words>:** duh.\n**+ping:** Returns diagnostic latency data, makes sure the bot's running.\n**+wiki <query>:** Searches the ArchWiki.\n**+ban:** returns a nice message");
    }
    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }
    if (command === "lmgtfy") {
        arg.shift();
        arg.shift();
        arg.join();
        var query = arg.toString().replace(/,/g, '+');
        message.channel.send("https://lmgtfy.com/?q=" + query);
    }
    if (command === "searx") {
        arg.shift();
        arg.shift();
        arg.join();
        var query = arg.toString().replace(/,/g, '%20');
        message.channel.send("https://searx.tadeo.ca/?q=" + query + "&categories=general");
    }
    if (command === "echo") {
        arg.shift();
        arg.shift();
        arg.join();
        var echo = arg.toString().replace(/,/g, ' ');
        message.channel.send(echo);
    }
    if (command === "wiki") {
        arg.shift();
        arg.shift();
        arg.join();
        var wiki = arg.toString().replace(/,/g, '+');
        message.channel.send("https://wiki.archlinux.org/index.php?search=" + wiki);
    }
    if (command === "ban") {
        message.channel.send("__**USER WAS BANNED FOR THIS POST**__");
    }
    if (command === "interject") {
        message.channel.send("I'd just like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux, or as I\'ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX.\n\nMany computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called \"Linux\", and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use.\n\nLinux is the kernel: the program in the system that allocates the machine\'s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called \"Linux\" distributions are really distributions of GNU/Linux. ");
    };
    message.delete();
    if (message.guild.id.toString().includes('297744523910578176')) {
        client.channels.get('439881143798595604').send( message.author.username + '(' + message.author.id + ') ran command `' + message.cleanContent + '` in ' + message.channel);
    }
});

client.login(config.token);
