import { INTEGER, Model, STRING } from "sequelize";
import { mainConfig } from "../utils/config.js";
import logger from "../utils/logger.js";
import { seqeuelizeDB } from "./database.js";



export class DiscordUserModel extends Model<{
    id?: number;
    createdAt?: Date;
    dcId: string;
}> {}

DiscordUserModel.init({
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
    modelName: mainConfig.section.models.discordUsers,
    underscored: true
})
 
DiscordUserModel.sync({alter: true}).then(() => {
    logger.info("DiscordUsers table synced!");
})
