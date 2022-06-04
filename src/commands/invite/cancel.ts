import { SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, MessageEmbed } from "discord.js";
import { InviteDataModel } from "../../models/inviteData.js";
import { StatusTypes } from "../../typings/invite.js";
import { commandsConfig } from "../../utils/config.js";
import discordutil from "../../utils/discordutil.js";
import { GuildSubCommand } from "../commands.js";

export class InviteCancelSubCommand extends GuildSubCommand {
    constructor() {
        super(commandsConfig.section.invite.subcommands.cancel.name, commandsConfig.section.invite.subcommands.cancel.description);
    }

    public async execute(_client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while the invitation is being checked...");


        // TODO: check if the invitation is exists, cancel it, if it's not, warn the user that it's not exists
        const recipient = commandInteraction.options.getUser(commandsConfig.section.invite.subcommands.cancel.options.recipient.name, true);
        const senderData = await discordutil.getOrCreateUserById(commandInteraction.user.id);
        const recipientData = await discordutil.getOrCreateUserById(recipient.id);

        const invitationData = await InviteDataModel.findOne({
            where: {
                guildId: commandInteraction.guild!.id,
                recipientId: recipientData[0].getDataValue('id'),
                senderId: senderData[0].getDataValue('id')
            }
        })

        if(!invitationData) {
            await commandInteraction.editReply("You haven't sent any invitation to this user on this guild!");
            return;
        }

        if(invitationData.getDataValue('status') != StatusTypes.PENDING) {
            await commandInteraction.editReply("The invitation must be pending to be canceled!");
            return;
        }

        const recipientDm = await recipient.createDM();
        const inviteMessage = await discordutil.fetchMessageFromDMById(recipientDm, invitationData.getDataValue('inviteMessageId'));
        if(inviteMessage != null) {
            const cancelledEmbed = new MessageEmbed();
            cancelledEmbed.setTitle("Invitation Canceled");
            cancelledEmbed.setDescription(`
            Your invitation from <@${commandInteraction.user.id}> has been canceled!
            `);

            cancelledEmbed.setColor('YELLOW');
            cancelledEmbed.setTimestamp();
            cancelledEmbed.setThumbnail(commandInteraction.user.avatarURL() ?? "https://static.wikia.nocookie.net/totem_pobbles/images/c/c1/Phoenix.png/revision/latest?cb=20200430194951");
            
            await inviteMessage.edit({embeds: [cancelledEmbed], components: []});
        }




        await commandInteraction.editReply("Invitation canceled!");
        invitationData.set('status', StatusTypes.CANCELLED);
        await invitationData.save();
    }

    public async init(_client: Client): Promise<void> {
        const recipient = new SlashCommandUserOption();

        recipient.setName(commandsConfig.section.invite.subcommands.cancel.options.recipient.name);
        recipient.setDescription(commandsConfig.section.invite.subcommands.cancel.options.recipient.description);
        recipient.setRequired(true);

        this.commandBuilder.addUserOption(recipient)
    }
    
}