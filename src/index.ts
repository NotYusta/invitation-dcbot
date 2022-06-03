import { configSection } from './utils/config.js';
import { Client } from 'discord.js';
import logger from './utils/logger.js';
import events from './events/events.js';
import { commandManager } from './commands/manager.js';

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING']
});
 
logger.info("Logging in...");
client.login(configSection.bot.token);
client.on('ready', async () => {
    if(client.user == null) process.exit(1);
    logger.info("Logged in as " + client.user.tag);
    logger.info("Application ID: " + client.user.id);

    console.log();
    events.init(client);
    await commandManager.init(client);

    logger.info("Bot is ready to use!");
});