
import { Client } from 'discord.js';
import logger from './utils/logger.js';
import events from './events/events.js';
import { commandManager } from './commands/manager.js';
import { mainConfig } from './utils/config.js';


const client = new Client({
    ws: {
        properties: {
            $os: mainConfig.section.bot.browser
        }
    },
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING']
});
 

logger.info("Logging in...");
client.login(mainConfig.section.bot.token);
client.on('ready', async () => {
    if(client.user == null) {
        logger.error("Failed to login, client.user is null");
        process.exit(1);
    }
    


    if(mainConfig.section.bot.activity.name.length > 0) {
        logger.info("Setting activity to " + mainConfig.section.bot.activity.name);
        client.user.setActivity({name: mainConfig.section.bot.activity.name, type: mainConfig.section.bot.activity.type, url: mainConfig.section.bot.activity.url});
    }

    if(mainConfig.section.bot.status.length > 0) {
        logger.info("Setting status to " + mainConfig.section.bot.status);
        client.user.setStatus(mainConfig.section.bot.status);
    }
    
    logger.info("Logged in as " + client.user.tag);
    logger.info("Application ID: " + client.user.id);


    console.log();
    await events.init(client);
    await commandManager.init(client);

    logger.info("Bot is ready to use!");
});