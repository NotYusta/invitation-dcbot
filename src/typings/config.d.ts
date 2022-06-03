import { Dialect } from "sequelize/types";

export interface YamlConfig {
    debug: boolean;
    bot: {
        token: string;

    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        dialect: Dialect;
        logging: boolean;
    }
}