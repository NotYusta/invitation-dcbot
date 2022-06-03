import { configSection } from './utils/config.js';
import { Client } from 'discord.js';
import logger from './utils/logger.js';

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING']
});
 
logger.info("Logging in...");
client.login(configSection.bot.token).then(() => {
    if(client.user == null) return;
    logger.info("Logged in as " + client.user.tag);

    console.log();
    logger.info("Starting engines...");
});

