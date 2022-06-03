import { Sequelize } from "sequelize/types";
import { mainConfig } from "../utils/config";

export const seqeuelizeDB = new Sequelize({
    username: mainConfig.section.database.username,
    password: mainConfig.section.database.password,
    database: mainConfig.section.database.database,
    host: mainConfig.section.database.host,
    dialect: mainConfig.section.database.dialect,
    logging: mainConfig.section.database.logging
})