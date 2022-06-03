import { configSection } from './utils/config.js';
import { Client } from 'discord.js';

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING']
});
 
console.log("Logging in...");
client.login(configSection.bot.token).then(() => {
    if(client.user == null) return;
    console.log("Logged in as " + client.user.tag);
});