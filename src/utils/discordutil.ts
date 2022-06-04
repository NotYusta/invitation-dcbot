import { Client, DMChannel, Message, User } from "discord.js"
import { DiscordUserModel } from "../models/discordUsers.js"
import logger from "./logger.js"

const getOrCreateUserById = (id: string): Promise<[DiscordUserModel, boolean]> => {
    return DiscordUserModel.findOrCreate({
        where: {
            dcId: id
        },
        defaults: {
            dcId: id
        }
    })
}

const fetchUserByDiscordId = async (client: Client, id: string): Promise<User | undefined> => {
    let result: User | undefined = undefined;
    try {
        result = await client.users.fetch(id);
    // eslint-disable-next-line no-empty
    } catch {
        logger.warn("Failed to fetch user with id: " + id);
    }

    return result;
}

const fetchMessageFromDMById = async (dmChannel: DMChannel, id: string): Promise<Message<boolean> | undefined> => {
    let result: Message<boolean> | undefined = undefined;
    try {
        result = (await dmChannel.messages.fetch()).get(id);
    // eslint-disable-next-line no-empty
    } catch {
        logger.warn("Failed to fetch message with id: " + id);
    }

    return result;
}
export default { getOrCreateUserById, fetchUserByDiscordId, fetchMessageFromDMById }