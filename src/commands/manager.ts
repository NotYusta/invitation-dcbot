/* eslint-disable @typescript-eslint/no-empty-function */
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Guild } from "discord.js";
import { PictureCommand } from "./picture/picture.js";
import fetch from "node-fetch";
import logger from "../utils/logger.js";
import { GuildCommand } from "./commands.js";
import { http } from "../utils/http.js";


const guildCommands: GuildCommand[] = [];
const registerToGuild = async (client: Client, guild: Guild) => {
    const commandsCurData: SlashCommandBuilder[] = [];

    for (const command of guildCommands) {
        await command.init(client);
        commandsCurData.push(command.commandBuilder);
    }


    for(const commandBuilder of commandsCurData) {
        // Ref: https://discord.com/developers/docs/interactions/application-commands#slash-commands
        // better to use own http than using the default module from discord.js
        await http.registerDiscordGuildCommand(client, commandBuilder, guild);
    
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
        new PictureCommand()
    );


    await registerToAllGuilds(client);
}

export const commandManager =  {
    init, registerToAllGuilds, registerToGuild, guildCommands
}

