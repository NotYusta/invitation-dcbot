import { INTEGER, Model, STRING } from "sequelize";
import logger from "../utils/logger.js";
import { seqeuelizeDB } from "./database.js";

export class DiscordUsers extends Model<{
    id: number;
    dcId: string;
}> {}

DiscordUsers.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dcId: {
        type: STRING,
        allowNull: false
    },
}, {
    sequelize: seqeuelizeDB,
    modelName: "discord_users",
    underscored: true
})
 
DiscordUsers.sync({alter: true}).then(() => {
    logger.info("DiscordUsers table synced!");
})
