import { Client, ButtonInteraction, CacheType, MessageEmbed } from "discord.js";
import { DiscordUserModel } from "../../models/discordUsers.js";
import { InviteDataModel } from "../../models/inviteData.js";
import { StatusTypes } from "../../typings/invite.js";
import discorduser from "../../utils/discordutil.js";
import logger from "../../utils/logger.js";
import { InteractionButtonData } from "../buttons.js";

class acceptButton extends InteractionButtonData {
    constructor() {
        super("invitation_accept", "Accept");
        this.messageButton.setStyle('SUCCESS');
    }

    public async exec(client: Client<boolean>, interaction: ButtonInteraction<CacheType>): Promise<void> {
        await interaction.deferReply({ephemeral: true});
        const inviteData = await InviteDataModel.findOne({where: {inviteMessageId: interaction.message.id}});
        if(inviteData == null) {
            await interaction.editReply("Invalid invitation, please try again later.");
            return;
        }

        let statusMessage = "Invitation accepted!";
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
            const acceptedEmbed = new MessageEmbed();
            acceptedEmbed.setTitle("Invitation accepted!");
            acceptedEmbed.setDescription(`
            <@${interaction.user.id}> has accepted your invitation on ${guild ? guild.name + " guild" : "unknown guild"}!
            
            **Let's get the party started!** :tada:
            `);
            acceptedEmbed.setThumbnail(interaction.user.avatarURL() ?? "https://static.wikia.nocookie.net/totem_pobbles/images/c/c1/Phoenix.png/revision/latest?cb=20200430194951");
            acceptedEmbed.setColor('GREEN');
            acceptedEmbed.setTimestamp();

            await senderDiscordUser.send({embeds: [acceptedEmbed]});

            
            await interaction.editReply(statusMessage);
            inviteData.set("status", StatusTypes.ACCEPTED);
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

export const AcceptInviteButton = new acceptButton();