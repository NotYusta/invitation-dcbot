import { SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, Client } from "discord.js";
import { commandsConfig } from "../../utils/config.js";
import { http } from "../../utils/http.js";
import logger from "../../utils/logger.js";
import { GuildCommand } from "../commands.js";


export class PictureCommand extends GuildCommand {
    constructor() {
        super(commandsConfig.section.picture.name, commandsConfig.section.picture.description);
    }

    public async execute(_client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while I'm downloading the picture...");

        const animalOption = commandInteraction.options.getString(commandsConfig.section.picture.options.animal.name, true);

        logger.debug(commandInteraction.user.tag + " requested a picture of " + animalOption);
        const pictureData = await http.getAnimalPicture(animalOption);
        

        await commandInteraction.editReply({
            content: "Fun fact: " + pictureData.fact,
            files: [{attachment: pictureData.image, name: "picture.png"}]
        });
    }
    

    public async init(_client: Client): Promise<void> {
        logger.debug("Initializing picture command");
        const animalOption = new SlashCommandStringOption();

        animalOption.setName(commandsConfig.section.picture.options.animal.name);
        animalOption.setDescription(commandsConfig.section.picture.options.animal.description);
        animalOption.addChoices({
            name: "dog",
            value: "dog",
        }, {
            name: "cat",
            value: "cat"
        });

        animalOption.setRequired(true);

        this.commandBuilder.addStringOption(animalOption);

        logger.debug("Picture command initialized");
    }
}

