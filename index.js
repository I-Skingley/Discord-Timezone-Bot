require('dotenv').config();

const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const fetch = require('node-fetch');
const tz_api = process.env.APIKEY_TZDB;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.log('Bot is online');
    
    // fetch(`http://api.timezonedb.com/v2.1/get-time-zone?key=${tz_api}&format=json&by=position&lat=40.689247&lng=-74.044502`)
    // .then(function (response) {
    //     return(response.json())
    // }).then(async function (data) {
    //     console.log(data);
    // });
    }
);

function convertUnix(unixtime) {
    var date = new Date(unixtime * 1000);
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (`${hour}:${min}:${sec}`);
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    const channel = client.channels.cache.get('1050079543383306333');
    console.log(`Command used: ${command.data.name}.`)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        /* For the /new slashcommand */
        if (command.data.name === 'time') {
            var location = await command.execute(interaction);

            console.log(`command response is: ${location}. With type: ${typeof location}`)
            if (String(location) === 'ip') {
                fetch(`http://worldtimeapi.org/api/ip`)
                    .then(function (response) {
                        return response.json();
                    }).then(async function (data) {
                        var time = convertUnix(data.unixtime);
                        await interaction.reply(`The time in ${data.timezone} is ${time}.`)
                        console.log('IP');
                    });
                return;
            }
        }


        else await command.execute(interaction);

    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// 