import { Sequelize } from "sequelize";
import { mainConfig } from "../utils/config.js";
export const seqeuelizeDB = new Sequelize({
    username: mainConfig.section.database.username,
    password: mainConfig.section.database.password,
    database: mainConfig.section.database.database,
    port: mainConfig.section.database.port,
    host: mainConfig.section.database.host,
    dialect: mainConfig.section.database.dialect,
    logging: mainConfig.section.database.logging,
    define: {
        underscored: true,
    }
})
