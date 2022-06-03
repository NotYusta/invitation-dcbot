import { SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { commandsConfig } from "../../utils/config.js";
import { GuildSubCommand } from "../commands.js";

export class InviteCancelSubCommand extends GuildSubCommand {
    constructor() {
        super(commandsConfig.section.invite.subcommands.cancel.name, commandsConfig.section.invite.subcommands.cancel.description);
    }

    public async execute(_client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while I'm generating the invite...");

        // TODO: check if the invitation is exists, cancel it, if it's not, warn the user that it's not exists
        const recipient = commandInteraction.options.getUser("target", true);


        await recipient.send({components: []})
        // await commandInteraction.editReply({
        //     content: "Here's the invite: " + invite.url,
        //     files: [{attachment: invite.url, name: "invite.png"}]
        // });
    }

    public async init(_client: Client): Promise<void> {
        const recipient = new SlashCommandUserOption();

        recipient.setName(commandsConfig.section.invite.subcommands.cancel.options.recipient.name);
        recipient.setDescription(commandsConfig.section.invite.subcommands.cancel.options.recipient.description);
        recipient.setRequired(true);

        this.commandBuilder.addUserOption(recipient)
    }
    
}