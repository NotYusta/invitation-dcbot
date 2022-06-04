import { Client } from "discord.js";
import { buttonManager } from "../buttons/manager.js";
import { commandManager } from "../commands/manager.js";
import { ButtonDataModel } from "../models/buttonData.js";
import logger from "../utils/logger.js";


export default (client: Client) => {
    client.on('interactionCreate', async (interaction) => {
        if(interaction.isCommand()) {
            logger.debug(interaction.user.tag + " executed a command: " + interaction.commandName);
            const cmd = commandManager.guildCommands.find(c => c.commandName === interaction.commandName);
            if (cmd == null) return;
            
            const subcmdname = interaction.options.getSubcommand(false);
            if(subcmdname != null) {
                const subcmd = cmd.subCommands.find(sc => sc.commandName == subcmdname);
                if (subcmd != null) {
                    
                    await subcmd.execute(client, interaction);
                    return;
                }
            }

            await cmd.execute(client, interaction);
            return;
        }

        if(interaction.isButton()) {
            logger.debug("Received button interaction: " + interaction.customId);
            const buttonData = await ButtonDataModel.findOne({where: {customId: interaction.customId}});
            if(buttonData == null) return;

            
            
            for(const interactionButton of buttonManager.interactionButtonsData) {
                if(buttonData.getDataValue('name') == interactionButton.name) {
                    await interactionButton.exec(client, interaction);
                    break;
                }
            }
        }
    })
}