import { Sequelize } from "sequelize/types";
import { configSection } from "../utils/config";

export const seqeuelizeDB = new Sequelize({
    username: configSection.database.username,
    password: configSection.database.password,
    database: configSection.database.database,
    host: configSection.database.host,
    dialect: configSection.database.dialect,
    logging: configSection.database.logging
})