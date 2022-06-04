import { Client, ButtonInteraction, CacheType, MessageEmbed } from "discord.js";
import { DiscordUserModel } from "../../models/discordUsers.js";
import { InviteDataModel } from "../../models/inviteData.js";
import { StatusTypes } from "../../typings/invite.js";
import discorduser from "../../utils/discordutil.js";
import logger from "../../utils/logger.js";
import { InteractionButtonData } from "../buttons.js";

class rejectButton extends InteractionButtonData {
    constructor() {
        super("invitation_reject", "Reject");
        this.messageButton.setStyle('DANGER')
    }

    public async exec(client: Client<boolean>, interaction: ButtonInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ephemeral: true});
        const inviteData = await InviteDataModel.findOne({where: {inviteMessageId: interaction.message.id}});
        if(inviteData == null) {
            await interaction.editReply("Invalid invitation, please try again later.");
            return;
        }

        let statusMessage = "Invitation rejected!";
        const inviteStatus = inviteData.getDataValue('status');
        if(inviteStatus == StatusTypes.PENDING) {
            const sender = await DiscordUserModel.findOne({where: {id: inviteData.getDataValue('senderId')}});
            if(sender == null) {
                logger.warn("Failed to find sender for invite with id: " + inviteData.getDataValue('id'));
                await interaction.editReply("An error occured while accepting the invite, please try again later.");
                return;
            }

            const senderDiscordUser = await discorduser.fetchUserByDiscordId(client, sender.getDataValue('dcId'));
            if(senderDiscordUser == null) {
                await interaction.editReply("An error occured while accepting the invite, please try again later.");
                return;
            }

            const guild = client.guilds.cache.get(inviteData.getDataValue('guildId'));
            const rejectedEmbed = new MessageEmbed();
            rejectedEmbed.setTitle("Invitation rejected!");
            rejectedEmbed.setDescription(`
            <@${interaction.user.id}> has rejected your invitation on ${guild ? guild.name + " guild" : "unknown guild"}!

            Don't be sad, sometimes you just have to **give up**  :cry:
            `);
            rejectedEmbed.setThumbnail(interaction.user.avatarURL() ?? "https://static.wikia.nocookie.net/totem_pobbles/images/c/c1/Phoenix.png/revision/latest?cb=20200430194951");
            rejectedEmbed.setColor('RED');
            rejectedEmbed.setTimestamp();

            await senderDiscordUser.send({embeds: [rejectedEmbed]});
            await interaction.editReply(statusMessage);
            inviteData.set("status", StatusTypes.REJECTED);
            await inviteData.save();
            
            return;
        } else  {
            switch(inviteStatus) {
                case StatusTypes.ACCEPTED:
                    statusMessage = "Invite already accepted!";
                    break;
                case StatusTypes.REJECTED:
                    statusMessage = "Invite already rejected!";
                    break;
                    case StatusTypes.CANCELLED:
                        statusMessage = "Invite already cancelled!";
                        break;
                default:
                    statusMessage = "An error occured while accepting the invite, please try again later.";
            }

            await interaction.editReply(statusMessage);
            return;
        }
    }
}

export const RejectInviteButton = new rejectButton();