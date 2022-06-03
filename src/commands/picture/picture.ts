import { SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, Client } from "discord.js";
import { http } from "../../utils/http.js";
import logger from "../../utils/logger.js";
import { GuildCommand } from "../commands.js";


export class PictureCommand extends GuildCommand {
    constructor() {
        super("picture", "Get a random picture from the internet");
    }

    public async execute(_client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while I'm downloading the picture...");

        const animalOption = commandInteraction.options.getString("animal", true);

        logger.debug(commandInteraction.user.tag + " requested a picture of " + animalOption);
        const pictureData = await http.getAnimalPicture(animalOption);
        

        await commandInteraction.editReply({
            content: "Fun fact: " + pictureData.fact,
            files: [{attachment: pictureData.image, name: "picture.png"}]
        });
    }
    

    public async init(_client: Client): Promise<void> {
        const animalOption = new SlashCommandStringOption();

        animalOption.setName("animal");
        animalOption.setDescription("The animal to get a picture of");
        animalOption.addChoices({
            name: "dog",
            value: "dog",
        }, {
            name: "cat",
            value: "cat"
        });

        animalOption.setRequired(true);

        this.commandBuilder.addStringOption(animalOption)
    }
}

