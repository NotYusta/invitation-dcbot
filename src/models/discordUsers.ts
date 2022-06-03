import { INTEGER, Model, STRING } from "sequelize/types";
import { seqeuelizeDB } from "./database";

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

DiscordUsers.sync();
