import { SlashCommandBuilder } from "@discordjs/builders";
import { Client } from "discord.js";
import { commandManager } from "../commands/manager.js";


export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        // i dont think caching is needed, but just in case
        const currCommandsData: SlashCommandBuilder[] = commandManager.guildCommands.map(c => c.commandBuilder);
        commandManager.registerToGuild(client, guild, currCommandsData);
    });
}