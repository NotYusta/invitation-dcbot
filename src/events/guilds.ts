import { Client } from "discord.js";
import { commandManager } from "../commands/manager.js";


export default (client: Client) => {
    client.on('guildCreate', (guild) => {
        commandManager.registerToGuild(client, guild);
    });
}