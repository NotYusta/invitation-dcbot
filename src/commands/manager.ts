/* eslint-disable @typescript-eslint/no-empty-function */
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Guild } from "discord.js";
import { PictureCommand } from "./picture/picture.js";
import { GuildCommand } from "./commands.js";
import { http } from "../utils/http.js";
import { InviteCommand } from "./invite/invite.js";
import logger from "../utils/logger.js";
import { commandsConfig } from "../utils/config.js";
import utils from "../utils/utils.js";


const guildCommands: GuildCommand[] = [
    new PictureCommand(),
    new InviteCommand(),
];

const registerToGuild = async (client: Client, guild: Guild, commandsData: SlashCommandBuilder[]) => {

    
    const addedCmdsId: string[] = []
    for(const commandBuilder of commandsData) {
        // Ref: https://discord.com/developers/docs/interactions/application-commands#slash-commands
        // better to use own http than using the default module from discord.js
        const result = await http.registerDiscordGuildCommand(client, commandBuilder, guild);
        if(result != null) {
            logger.debug(`Added command ${commandBuilder.name} to guild ${guild.name} with id ${result?.id}`);
            addedCmdsId.push(result.id);
        }


        // To prevent too many requests (429)
        await utils.sleep(200);
    }
    

    if(commandsConfig.section.deleteUnknownCommands) {
        const guildCommandsData = await http.getGuildCommands(client, guild.id);

        if(guildCommandsData == null) return;
        for(const commandInfo of guildCommandsData) {
            if(addedCmdsId.includes(commandInfo.id)) continue;

            const responseText = await http.deleteDiscordGuildCommand(client, commandInfo.id, guild);
            if(responseText != "No Content") {
                logger.warn(`Failed to delete command ${commandInfo.id} from guild ${guild.name}, reason: ${responseText}`);
            } else {
                logger.info(`Deleted command ${commandInfo.id} from guild ${guild.name}`);
            }

            // To prevent too many requests (429)
            await utils.sleep(200);
        }
    }
    
}

const registerToAllGuilds = async (client: Client, commandsData: SlashCommandBuilder[]) => {
    return await Promise.all(client.guilds.cache.map(async (guild) => {
        await registerToGuild(client, guild, commandsData);
    }));
}


const init = async (client: Client) => {
    const currCommandsData: SlashCommandBuilder[] = [];
    for(const guildCommand of guildCommands) {
        await guildCommand.init(client);
        for(const guildSubCmd of guildCommand.subCommands) {
            await guildSubCmd.init(client);
            guildCommand.commandBuilder.addSubcommand(guildSubCmd.commandBuilder);
        }

        currCommandsData.push(guildCommand.commandBuilder);
    }

    await registerToAllGuilds(client, currCommandsData);
}

export const commandManager =  {
    init, registerToAllGuilds, registerToGuild, guildCommands
}

