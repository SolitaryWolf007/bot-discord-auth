//========================================================
// SYSTEM REQUIRES
//========================================================
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const express = require('express');
//========================================================
// SCRIPT REQUIRES
//========================================================
const commands = require('./code/bot-commands');
const auth = require('./code/api-routes/auth');
//========================================================
// REST - GUILD COMMANDS
//========================================================
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        
        //console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.BOT_GUILD_ID),{ body: commands });
        //console.log('Successfully reloaded application (/) commands.');

    }catch(e){
        console.log('\x1b[31m[DEBUG] '+e+'\x1b[0m');
    }
})();
//========================================================
// DISCORD JS - INTERACTION
//========================================================
const client = new Client({ intents: [ Intents.FLAGS.GUILDS ] });

client.on('ready', async () => {
    console.log(`[BOT] Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    commands.forEach(element => {
        if (interaction.commandName === element.name) {
            element.callback(client,interaction);
            return;
        }
    });
});

client.login(process.env.BOT_TOKEN);
//========================================================
// EXPRESS - ROUTES
//========================================================
const app = express();

app.use(express.json({ strict: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/auth', auth(client));

app.listen(process.env.AUTH_PORT,() => { console.log(`[SERVICE] Service Started!`); })