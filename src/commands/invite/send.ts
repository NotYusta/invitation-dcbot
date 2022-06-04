import { SlashCommandUserOption } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction, DMChannel, Message, MessageActionRow, MessageEmbed, User } from "discord.js";
import { AcceptInviteButton } from "../../buttons/invite/accept.js";
import { RejectInviteButton } from "../../buttons/invite/reject.js";
import { InviteDataModel } from "../../models/inviteData.js";
import { StatusTypes } from "../../typings/invite.js";
import { commandsConfig } from "../../utils/config.js";
import discordutil from "../../utils/discordutil.js";
import logger from "../../utils/logger.js";
import utils from "../../utils/utils.js";
import { GuildSubCommand } from "../commands.js";

export class InviteSendSubCommand extends GuildSubCommand {
    constructor() {
        super(commandsConfig.section.invite.subcommands.send.name, commandsConfig.section.invite.subcommands.send.description);
    }

    private async sendInvitation(commandInteraction: CommandInteraction, recipient: User, dataModel: [InviteDataModel, boolean]): Promise<void> {
        try {
            const embed = new MessageEmbed();
            embed.setTitle("Invitation");
            embed.setDescription(`
            You have been **invited** to the invitation party from ${commandInteraction.guild!.name} guild by <@${commandInteraction.user.id}>!

            Please accept or reject the invitation by clicking the buttons below.
            `);
            embed.setThumbnail(commandInteraction.user.avatarURL() ?? "https://static.wikia.nocookie.net/totem_pobbles/images/c/c1/Phoenix.png/revision/latest?cb=20200430194951");
            
            const rejectInviteButton = RejectInviteButton.clone();
            const acceptInviteButton = AcceptInviteButton.clone();

            const component = new MessageActionRow().addComponents(
                acceptInviteButton.messageButton,
                rejectInviteButton.messageButton,
            )

            const message = await recipient.send({ components: [component], embeds: [embed]})
            await commandInteraction.editReply({
                content: "You have sent an invitation to " + recipient.username + "!"
            });

            await dataModel[0].update({
                status: StatusTypes.PENDING,
                invitationDate: new Date(),
                inviteMessageId: message.id 
            });

            await rejectInviteButton.createModel();
            await acceptInviteButton.createModel();
        } catch(err) {
            logger.warn("Failed to send invite message", err);
            await commandInteraction.editReply("I couldn't send the invitation, please try again later.");

            // destroy the invitation, the user's dm channel is probably closed.
            await dataModel[0].destroy();
        }
    }
    public async execute(client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        await commandInteraction.deferReply();
        await commandInteraction.editReply("Please wait while I'm generating the invite...");

        const recipient = commandInteraction.options.getUser(commandsConfig.section.invite.subcommands.send.options.recipient.name, true);
        const senderData = await discordutil.getOrCreateUserById(commandInteraction.user.id);
        const recipientData = await discordutil.getOrCreateUserById(recipient.id);

        if(recipient.id == commandInteraction.user.id) {
            await commandInteraction.editReply("You can't invite yourself!");
            return;
        }

        const dataModel = await InviteDataModel.findOrCreate({
            where: {
                senderId: senderData[0].getDataValue('id'),
                recipientId: recipientData[0].getDataValue('id'),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                guildId: commandInteraction.guild!.id
            },
            defaults: {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                senderId: senderData[0].getDataValue('id')!,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                recipientId: recipientData[0].getDataValue('id')!,
                status: StatusTypes.PENDING,
                inviteMessageId: "",
                invitationDate: new Date(),
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                guildId: commandInteraction.guild!.id
            }
        });

        if(!dataModel[1]) {
            const timeCreated = dataModel[0].getDataValue('invitationDate').getTime();

            logger.debug("Cooldown: " + commandsConfig.section.invite.cooldown)
            const timeLeft = (timeCreated + commandsConfig.section.invite.cooldown) - Date.now();
            const statusValue = dataModel[0].getDataValue('status');

            logger.debug("Time created: " + timeCreated);
            logger.debug("Current time: " + Date.now());
            logger.debug("Time left: " + timeLeft);
            if(statusValue == StatusTypes.PENDING) {
                if(timeLeft > 0) {
                    await commandInteraction.editReply("This invitation is already sent, please wait for the recipient to accept it, you may send another invitation in " + utils.formatMsToTime(timeLeft));
                    return;
                }

                await this.sendInvitation(commandInteraction, recipient, dataModel);
                return;
            } else if (statusValue == StatusTypes.ACCEPTED) {
                await commandInteraction.editReply("This invitation is already accepted!");
                return;
            } else if (statusValue == StatusTypes.REJECTED) {
                if(timeLeft > 0) {
                    await commandInteraction.editReply("This invitation was rejected, you can send it again in " + utils.formatMsToTime(timeLeft));
                    return;
                }


                await this.sendInvitation(commandInteraction, recipient, dataModel);
            } else if (statusValue == StatusTypes.CANCELLED) {
                if(timeLeft > 0) {
                    await commandInteraction.editReply("This invitation was cancelled, you can send it again in " + utils.formatMsToTime(timeLeft));
                    return;
                }
                
                await this.sendInvitation(commandInteraction, recipient, dataModel);
            }

            return;
        } else {
            await this.sendInvitation(commandInteraction, recipient, dataModel);
        }
    }

    public async init(_client: Client): Promise<void> {
        const recipient = new SlashCommandUserOption();

        recipient.setName(commandsConfig.section.invite.subcommands.send.options.recipient.name);
        recipient.setDescription(commandsConfig.section.invite.subcommands.send.options.recipient.description);
        recipient.setRequired(true);

        this.commandBuilder.addUserOption(recipient)
    }
}