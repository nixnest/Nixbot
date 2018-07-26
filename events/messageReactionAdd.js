// guildCreate.js

module.exports = async (config, client, influx, vote, react) => {
//    console.log(vote);
//    console.log('id');
//    console.log(react.message.id);
//    console.log('emoji');
//    console.log(react.emoji.name);
//    console.log(react.count);
//    console.log(vote[react.message.id]);
    if (vote[react.message.id] == 0) {
        if (react.emoji.name.toString() == '⬆') {
            if (react.count.toString() == '6') {
                react.message.delete();
            }
        }
    }
//        console.log('delete it')
}

