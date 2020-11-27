function checkJson(str){
    try {
        JSON.parse(str);
    } catch (e) {
        return e;
    }
    return false;
}

module.exports = {
    name: 'embed',
    description: 'Create an embed from JSON data',
    arguments: {
        required: ['JSON_Data']
    },
    async execute(bot, message, args){
        var data = args.join(" ");
        var res = checkJson(data);
        if(res) throw res;
        data = JSON.parse(data);
        if(!data.footer) data.footer = {};
        var _thing = `Embed made by: ${message.author.tag}`;
        if(data.footer.text && data.footer.text >= 2048) data.footer.text = data.footer.text.slice(0,-_thing.length + 3) + "...";
        data.footer.text = data.footer.text ? data.footer.text + " | " + _thing : _thing;
        message.channel.send({
            embed: data
        });
    }
};