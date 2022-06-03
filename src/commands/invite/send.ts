import { SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { commandsConfig } from "../../utils/config.js";
import { GuildSubCommand } from "../commands.js";

export class InviteSendSubCommand extends GuildSubCommand {
    constructor() {
        super(commandsConfig.section.invite.subcommands.send.name, commandsConfig.section.invite.subcommands.send.description);
    }

    public async execute(_client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while I'm generating the invite...");

        // TODO: check if the invitation is exists, 
        // if not, create it, if it does exists, check if it's expired, if it is, create it and modify the text to expired and delete the existing one, if it's not remind the user to wait
        const recipient = commandInteraction.options.getUser("target", true);


        await recipient.send({components: []})
        // await commandInteraction.editReply({
        //     content: "Here's the invite: " + invite.url,
        //     files: [{attachment: invite.url, name: "invite.png"}]
        // });
    }

    public async init(_client: Client): Promise<void> {
        const recipient = new SlashCommandUserOption();

        recipient.setName(commandsConfig.section.invite.subcommands.send.options.recipient.name);
        recipient.setDescription(commandsConfig.section.invite.subcommands.send.options.recipient.description);
        recipient.setRequired(true);

        this.commandBuilder.addUserOption(recipient)
    }
}