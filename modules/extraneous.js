// extraneous.js

module.exports = {
    embedLength: 1020,
    lengthSplit: (message, length) => {
        var splitCount = Math.floor(message.length / length) + 1
        var splits = []

        for (var n = 0; n < splitCount; n++) {
            splits.push(message.substr(0 + (n * length), length))
        }

        if (!splits[splits.length - 1]) {
            splits.pop()
        }
        console.log(splits)
        return splits
    },

    fieldGenerator: (message, msgTitle) => {
        console.log(msgTitle)
        console.log(message)
        var splits = module.exports.lengthSplit(message, module.exports.embedLength)
        var fields = []
        if (splits.length === 1) {
            fields = [{
                name: msgTitle,
                value: '` ' + splits[0] + ' `'
            }]
        } else {
            for (var n = 0; n < splits.length; n++) {
                fields.push({
                    name: msgTitle + ' (' + n + ')',
                    value: '` ' + splits[n] + ' `'
                })
            }
        }
        console.log(fields)
        return fields
    },
    urlGenerator: (msgObj) => {
        var url = `https://discordapp.com/channels/${msgObj.guild.id}/${msgObj.channel.id}/${msgObj.id}`
        return url
    },
    sleep (ms = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms)
        })
    }
}
