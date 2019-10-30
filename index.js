//// Skrypt stworzony przez Taki Tam Slu#5916.
// 1. Co daje nam "Command Handler"? 
// Daje to, że wszystkie polecenia bota mamy w osobnym pliku które znajdują się w folderze "commands". 
// Jest to moim zdaniem bardzo dobra opcja, ponieważ nie musimy wszystkich komend trzymać w jednym pliku "index.js" co jest bez sensu!
// 2. Wszystkie polecenia bota trzymaj w katalogu "commands".
// 3. Prefix bota jest możliwy do zmiany w pliku "config.json".
////

const Discord = require("discord.js");
var fs = require("fs");
const config = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        // Brak komend w katalogu "commands"? Ten skrypt poinformuje Cię o tym.
        return console.log("[--:--]: Status [ERROR 404]: File Not Found. Folder 'commands' is empty.");
    }
    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        client.commands.set(props.help.name, props);
    });
});

client.on("ready", () => {
    client.user.setActivity("teamspeak: hypersurvival.pl", {type: "WATCHING"})
    client.user.setStatus('dnd', 'Made by .EXE') 

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
    // Bot gotowy? Daj informacje w konsoli!
    console.log("Bot Zostal wlaczony!");
});

client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = config.prefix;
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let commandfile = client.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(client,message,args);
});

client.login(process.env.BOT_TOKEN);
