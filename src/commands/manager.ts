/* eslint-disable @typescript-eslint/no-empty-function */
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Guild } from "discord.js";
import { PictureCommand } from "./picture/picture.js";
import { GuildCommand } from "./commands.js";
import { http } from "../utils/http.js";
import { InviteCommand } from "./invite/invite.js";
import logger from "../utils/logger.js";
import { commandsConfig } from "../utils/config.js";


const guildCommands: GuildCommand[] = [];
const registerToGuild = async (client: Client, guild: Guild) => {
    const commandsCurData: SlashCommandBuilder[] = [];

    for (const command of guildCommands) {
        await command.init(client);
        commandsCurData.push(command.commandBuilder);
    }

    const addedCmdsId: string[] = []
    for(const commandBuilder of commandsCurData) {
        // Ref: https://discord.com/developers/docs/interactions/application-commands#slash-commands
        // better to use own http than using the default module from discord.js
        const result = await http.registerDiscordGuildCommand(client, commandBuilder, guild);
        if(result != null) {
            addedCmdsId.push(result.id);
        }
    }

    if(commandsConfig.section.deleteUnknownCommands) {
        logger.info("Deleting unknown commands...");
        const guildCommandsData = await http.getGuildsCommands(client);

        for(const commandInfo of guildCommandsData ) {
            if(addedCmdsId.includes(commandInfo.id)) continue;

            const isSuccess = await http.deleteDiscordGuildCommand(client, commandInfo.id, guild);
            if(!isSuccess) {
                logger.warn(`Failed to delete command ${commandInfo.id} from guild ${guild.name}`);
            } else {
                logger.info(`Deleted command ${commandInfo.id} from guild ${guild.name}`);
            }
        }
        
        logger.info("Done!");
    }
    
}

const registerToAllGuilds = async (client: Client) => {
    const unresolved = client.guilds.cache.map(async (guild) => {
        await registerToGuild(client, guild);
    })

    return await Promise.all(unresolved);
}


const init = async (client: Client) => {
    guildCommands.push(
        new PictureCommand(),
        new InviteCommand()
    );


    await registerToAllGuilds(client);
}

export const commandManager =  {
    init, registerToAllGuilds, registerToGuild, guildCommands
}

