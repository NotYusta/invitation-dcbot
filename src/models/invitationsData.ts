import { INTEGER, Model, STRING } from "sequelize";
import logger from "../utils/logger.js";
import { seqeuelizeDB } from "./database.js";

export class InvitationsData extends Model<{
    id: number;
    senderId: number;
    recipientId: number;
    inviteMessageId: string;
    status: number;
}> {}

InvitationsData.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    }
}, {
    sequelize: seqeuelizeDB,
    modelName: "invitations_data",
    underscored: true
})

InvitationsData.sync({alter: true}).then(() => {
    logger.info("InvitationsData table synced!");
})