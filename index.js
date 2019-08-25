const Discord = require('discord.js')
const bot = new Discord.Client();

require('dotenv').config();

const PREFIX = '!';

var botInfo = "Version: 1.0 | Creator: Kees @ChocoKeesCake | Date Created: 08/23/2019 07:00am";

// uncomment color if color command is enabled
// var color;

bot.on('ready', () =>{
    console.log('The bot is online!');
})

// Greeting
bot.on('message', msg=>{
    if(msg.content === "Hey"){
        msg.reply('Hello friend!');
    }
})

// Annoyed bot reponse to a ping
bot.on('message', msg=>{
    if(msg.isMentioned(bot.user)){
        msg.reply('WHAT bRuV?!');
    }
})

// Commands
bot.on('message', message =>{

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){

        // Ping-Pong
        case 'ping':
            message.channel.sendMessage('pong!')
            break;

        // Bot information
        case 'info':
            message.channel.sendMessage(botInfo)
            break;

        /* Uncomment to enable custom colors on description and comment first3 line of the desc command
           case 'color':
            if(!args[1]) return message.channel.sendMessage('Error: Please enter a six digit number after !color')
            color = args[1]
            message.channel.sendMessage('Your favourite color has been set to 0x' + color)
            break; */

        // Bulk deletes messages on the channel
        case 'clear':
            if(!args[1]) return message.channel.sendMessage('Error: Please enter the number of lines to erase after !clear')
            message.channel.bulkDelete(args[1]);
            break;

        // Provides a description of the author in a rich embed 
        case 'desc':
            var dt = new Date();
            var color = (dt.getSeconds() + 200) * 1000;
            const desc = new Discord.RichEmbed()
            .setTitle('User Information')
            // uncomment the bottom line if color command is enabled
            // .setDescription('Use !color followed by the hex color to set your favourite color')
            .setThumbnail(message.author.avatarURL)
            .setColor('0x' + color)
            .addField('Username', message.author.username)
            .addField('Current Server', message.guild.name);
            message.channel.sendEmbed(desc);
            break;

        // Displays a random image from the internet (lorem picsum)
        case 'image':
            var dt = new Date();
            var rand = dt.getHours() + dt.getSeconds();
            const image = new Discord.RichEmbed()
            .setTitle('Random Image Fetcher')
            .setDescription('Displays a random image from the internet')
            .setColor(color)
            .addField('ID', rand);
            message.channel.sendEmbed(image);
            message.channel.sendMessage('https://picsum.photos/id/' + rand + '/200/300');
            break;

        //Spames the channel and author :P
        case 'spam':
            for(var i=0; i<10; i++) 
                message.author.sendMessage('@#$%^&*()_+-=abcdefghijklmnopq___$%@rstuvwxyz12*34567890[]')
            for(var i=0; i<5; i++) 
                message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopq___$%@rstuvwxyz12*34567890[]');
            
            // When Discord.js adds colored text :'(

                /* // message.setColor(0x9400D3);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0x4B0082);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0x0000FF);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0x00FF00);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0xFFFF00);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0xFF7F00);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]');
            // message.setColor(0xFF0000);
            message.channel.sendMessage('@#$%^&*()_+-=abcdefghijklmnopqrstuvwxyz1234567890[]'); */
            break;
    }

})

bot.login(process.env.TOKEN_ID);