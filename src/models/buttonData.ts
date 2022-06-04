import { INTEGER, Model, STRING } from "sequelize";
import { mainConfig } from "../utils/config.js";
import logger from "../utils/logger.js";
import { seqeuelizeDB } from "./database.js";

export class ButtonDataModel extends Model<{
    id?: number;
    name: string;
    customId: string;
}> {}

ButtonDataModel.init({
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: STRING,
        allowNull: false
    },
    customId: {
        type: STRING,
        allowNull: false
    },
}, {
    sequelize: seqeuelizeDB,
    modelName: mainConfig.section.models.buttonData,
    underscored: true
})

ButtonDataModel.sync({alter: true}).then(() => {
    logger.info("ButtonData table synced!");
})