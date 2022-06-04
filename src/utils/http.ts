import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Guild } from "discord.js";
import { AnimalPictureResponse, GuildCommandSimpleInfo } from "../typings/http"
import logger from "./logger.js";
import fetch from "node-fetch";

const getAnimalPicture = async (animal: string): Promise<AnimalPictureResponse> => {
    const response = await fetch(`https://some-random-api.ml/animal/${animal}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return await response.json() as AnimalPictureResponse;
}

const getGuildCommands = async (client: Client, guildId: string): Promise<GuildCommandSimpleInfo[] | undefined>  => {
    const response = await fetch(`https://discord.com/api/v10/applications/${client.user?.id}/guilds/${guildId}/commands`, {
        method: "GET",
        headers: {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        },
    });

    const result = await response.json() as GuildCommandSimpleInfo[];
    if (!Array.isArray(result)) {
        logger.warn(`Failed to get commands for guild ${guildId}`);
        return undefined;
    }


    return result;
}

const deleteDiscordGuildCommand = async(client: Client, commandId: string, guild: Guild): Promise<string> => {
    const response = await fetch(`https://discord.com/api/v10/applications/${client.user?.id}/guilds/${guild.id}/commands/${commandId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        },
    })
    
    return response.statusText;
}

const registerDiscordGuildCommand = async(client: Client, commandBuilder: SlashCommandBuilder, guild: Guild): Promise<GuildCommandSimpleInfo | undefined> => {
    const response = await fetch(`https://discord.com/api/v10/applications/${client.user?.id}/guilds/${guild.id}/commands`, {
        body: JSON.stringify(commandBuilder.toJSON()),
        method: "POST",
        headers: {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        },
    })
    
    if(response.status != 200 && response.status != 201) {
        logger.warn(`Failed to register command ${commandBuilder.name} to guild ${guild.name}, status: ${response.status}, reason: ${response.statusText}`);
        return undefined;
    } else {
        logger.info(`Registered command ${commandBuilder.name} to guild ${guild.name}`);
        return await response.json() as GuildCommandSimpleInfo;
    }
}

export const http = { getAnimalPicture, registerDiscordGuildCommand, getGuildCommands, deleteDiscordGuildCommand }