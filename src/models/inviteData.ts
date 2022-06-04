import { DATE, INTEGER, Model, STRING } from "sequelize";
import { mainConfig } from "../utils/config.js";
import logger from "../utils/logger.js";
import { seqeuelizeDB } from "./database.js";

export class InviteDataModel extends Model<{
    id?: number;
    invitationDate: Date;
    senderId: number;
    recipientId: number;
    inviteMessageId: string;
    status: number;
    guildId: string;
}> {}

InviteDataModel.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invitationDate: {
        type: DATE  ,
        allowNull: false
    },
    senderId: {
        type: INTEGER,
        allowNull: false
    },
    recipientId: {
        type: INTEGER,
        allowNull: false
    },
    inviteMessageId: {
        type: STRING,
        allowNull: false
    },
    status: {
        type: INTEGER,
        allowNull: false
    },
    guildId: {
        type: STRING,
        allowNull: false
    },
}, {
    sequelize: seqeuelizeDB,
    modelName: mainConfig.section.models.inviteData,
    underscored: true
})

InviteDataModel.sync({alter: true}).then(() => {
    logger.info("InvitationsData table synced!");
})