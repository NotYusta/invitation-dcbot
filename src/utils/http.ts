import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, Guild } from "discord.js";
import { AnimalPictureResponse } from "../typings/http"
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

const registerDiscordGuildCommand = async(client: Client, commandBuilder: SlashCommandBuilder, guild: Guild): Promise<void> => {
    const response = await fetch(`https://discord.com/api/v10/applications/${client.user?.id}/guilds/${guild.id}/commands`, {
        body: JSON.stringify(commandBuilder.toJSON()),
        method: "POST",
        headers: {
            "Authorization": `Bot ${client.token}`,
            "Content-Type": "application/json"
        },
    })
    
    if(response.status != 200) {
        logger.warn(`Failed to register command ${commandBuilder.name} to guild ${guild.id}`);
    } else {
        logger.info(`Registered command ${commandBuilder.name} to guild ${guild.id}`);
    }
}

export const http = { getAnimalPicture, registerDiscordGuildCommand }