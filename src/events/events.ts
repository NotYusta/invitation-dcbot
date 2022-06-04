import { Client } from "discord.js";
import logger from "../utils/logger.js";
import guilds from "./guilds.js";
import interactionCreate from "./interactionCreate.js";


export default {
    init: async (client: Client) => {
        logger.info("Registering events...");

        interactionCreate(client);
        guilds(client);
        
        logger.info("Events registered!");
    }
}
