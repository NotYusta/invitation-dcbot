import { PresenceStatusData } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { Dialect } from "sequelize/types";



export interface MainConfig {
    debug: boolean;
    cache: {
        invite: boolean;
    }
    bot: {
        token: string;
        browser: string;
        status: PresenceStatusData;
        activity: {
            name: string;
            type: ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>;
            url: string;
        }
    };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        dialect: Dialect;
        logging: boolean;
    };
    models: {
        inviteData: string;
        discordUsers: string;
        buttonData: string;
    }
}

export interface CommandsConfig {
    deleteUnknownCommands: boolean;
    picture: {
        name: string;
        description: string;
        options: {
            animal: {
                description: string;
                name: string;
            }
        }
    }
    invite: {
        name: string;
        description: string;
        cooldown: number;
        subcommands: {
            send: {
                name: string;
                description: string;
                options: {
                    recipient: {
                        description: string;
                        name: string;
                    }
                }
            };
            cancel: {
                name: string;
                description: string;
                options: {
                    recipient: {
                        description: string;
                        name: string;
                    }
                }
            };
        }
    }
}