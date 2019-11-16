const Discord = require('discord.js');
const fs = require('fs');
const YTDL = require('ytdl-core');
const bot = new Discord.Client();
const botconfig = require('./botconfig.json')
require('dotenv').config(); 

var finder = require('findit')(botconfig.dirPath);
var path = require('path');
var servers = {};

function log(message){
     
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate() + ' '
        + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
    let text = date + ' | ' + message.author.tag + " > " + message;
    let fileName = './Logs/' + message.guild.name + '_' + message.guild.id + '.txt';
        
    fs.writeFile(fileName, text, (err) => {  
        if (err) throw err;
        else console.log("Wrote to " + fileName + '->' + text);
    }) 

}

function play(connection, message) {
    
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}


// Beta (It does not work ¯\_(ツ)_/¯)
function playClip(connection, message){
    
    var server = servers[message.guild.id];

    server.dispatcher = connection.playFile('C:/Users/Kees/Desktop/DiscordBot/audio/' + args[0]);

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

// Lists the clips stored on the server
function showClips() {

    var clipNames = [];
    var i = 0;
    fs.readdir(botconfig.dirPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
    
        //listing all files using forEach
        files.forEach(function (file) {
            clipNames[i] = file;
            i++;
        });
    });

    return clipNames;

    /* const clips = new Discord.RichEmbed()
        .setTitle("Clips")
        .setDescription("Play a clip using !clip <clip name>")
        .addField("Clip names", clipNames);

    message.channel.sendEmbed(clips); */
}

// When bot is online
bot.on('ready', () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("SpongeBob SquarePants", {type: "WATCHING"});
});

// Commands
bot.on('message', message => {

    // Greeting
    if(message.content.includes('Hey')){
        message.reply('Hello friend!');
    }

    // Annoyed bot reponse to a ping
    if(message.isMentioned(bot.user)){
        message.reply('WHAT bRuV?!');
    }

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command){

        case 'commands': 
            const commands = new Discord.RichEmbed()
            .setTitle(`${bot.user.username} Commands`)
            .setThumbnail(bot.user.avatarURL)
            .setColor(0x0900FF)
            .setDescription('Use & followed by the commands to make requests.')
            .addField('play', "Use play followed by a youtube link to playthe video in vc")
            .addField('skip', "Skip the yt video playing in vc")
            .addField('stop', "Stop the yt vid playing in vc")
            .addField('ping')
            .addField('serverinfo', "&serverinfo")
            .addField('botinfo', "&botinfo")
            .addField('color', "Changes the color of the info commands")
            .addField('myinfo', "&myinfo")
            .addField('image', "Try it.. YOU WON'T")

            message.channel.sendEmbed(commands); 
            break;
        
        // Play youtube link on VC
        case 'play':
            
            if(!message.member.voiceChannel) return message.reply("You must be in a voice channel")
            
            if(!args[0]) return message.reply("Please provide a Youtube link");

            if(!args[0].includes("youtube.com" || "youtu.be")) return message.reply("Please provide a Youtube link.");
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[0]);

            try{
                
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                    play(connection, message); 
                });
            
            } catch(err){
                console.log(err);
            }

            break;

        // Skip the link currently playing in queue
        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            break;

        /* case 'pause':
            var server = servers[message.guild.id];
            message.reply("Use !resume to continue playback or !stop to end playback");
            server.dispatcher.pause(); // Pause the stream
            break;

        case 'resume':
            var server = servers[message.guild.id];
            server.dispatcher.resume(); // Carry on playing
            break; */

        // completely stop playback and disconnect
        case 'stop': 
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;

        case 'clip':
            if(!message.member.voiceChannel) return message.reply("You must be in a voice channel")

            if(!args[0]) message.reply("Specify a clip from the audio clips available..." + showClips());

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[0]);

            try{
                
                if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                    play(connection, message); 
                });
            
            } catch(err){
                console.log(err);
            }

            break;

        // Ping-Pong
        case 'ping':
            message.channel.sendMessage('pong!')
            break;

        // Bot information
        case 'botinfo':
            
        const botInfo = new Discord.RichEmbed()
            .setTitle(`${bot.user.username} Information`)
            .setThumbnail(bot.user.avatarURL)
            .setColor(0x0900FF)
            .addField('Version', botconfig.version)
            .addField('Creator', botconfig.creator)
            .addField('Date created', botconfig.dateCreated)
            .setURL(`https://github.com/KeenanDs/DiscordBot`);
            message.channel.sendEmbed(botInfo); 
            break;

        // Server information
        case 'serverinfo':
            const serverInfo = new Discord.RichEmbed()
            .setTitle('Server Information')
            .setDescription(`Server information for ${message.author}`)
            .setThumbnail(message.guild.iconURL)
            .addField('Server Name', message.guild.name)
            .addField('Channel Name', message.channel.name)
            .addField('Created On', message.guild.createdAt)
            .addField('You Joined', message.member.joinedAt)
            .addField('Total Members', message.guild.memberCount);
            message.channel.sendEmbed(serverInfo);
            break;

        // Allows theuser to pick a color for desc
        case 'color':
            if(!args[0]) return message.channel.sendMessage('Error: Please enter a six digit number after !color')
            botconfig.color = args[0]
            const colorEmbed = new Discord.RichEmbed()
            .setDescription(`Your favourite color has been set to 0x${botconfig.color}`)
            .setColor(botconfig.color);
            message.channel.sendEmbed(colorEmbed); 
            break;
        
        // User information
        case 'myinfo':
            const myInfo = new Discord.RichEmbed()
            .setTitle('User Information')
            .setDescription('Use !color followed by the hex color to set your favourite color')
            .setThumbnail(message.author.avatarURL)
            .setColor('0x' + botconfig.color)
            .addField('Username', message.author.username)
            .addField('ID', message.author.tag)
            .addField('Last Message', message.author.lastMessage)
            .addField('Presence', message.author.presence)
            .addField('Favourite Color', `0x${botconfig.color}`)
            .addField('Current Server', message.guild.name);            
            message.channel.sendEmbed(myInfo);
            break;

        // Bulk deletes messages on the channel
        case 'clear':
            if(!args[1]) return message.channel.sendMessage('Error: Please enter the number of lines to erase after !clear')
            message.channel.bulkDelete(args[1]);
            break;

        // Displays a random image from the internet (lorem picsum)
        case 'image':
            let dt = new Date();
            let rand = dt.getHours() + dt.getSeconds();
            const image = new Discord.RichEmbed()
            .setTitle('Random Image Fetcher')
            .setDescription('Displays a random image from the internet')
            .setColor(rand)
            .addField('ID', rand);
            message.channel.sendEmbed(image);
            message.channel.sendMessage(`https://picsum.photos/id/${rand}/200/300`);
            break;

        //Spames the channel and author :P
        case 'spam':
            for(let i=0; i<10; i++) 
                message.author.sendMessage('@#$%^&*()_+-=abcdefghijklmnopq___$%@rstuvwxyz12*34567890[]')
            for(let i=0; i<5; i++) 
                message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopq___$%@rstuvwxyz12*34567890[]');
            break;
    }

    log(message);
});

bot.login(process.env.TokenID);