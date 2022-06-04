import { CacheType, Client, CommandInteraction } from "discord.js";
import { commandsConfig } from "../../utils/config.js";
import { GuildCommand } from "../commands.js";
import { InviteCancelSubCommand } from "./cancel.js";
import { InviteSendSubCommand } from "./send.js";

export class InviteCommand extends GuildCommand {
    
    constructor() {
        super(commandsConfig.section.invite.name, commandsConfig.section.invite.description);
        this.subCommands.push(
            new InviteCancelSubCommand(),
            new InviteSendSubCommand()
        )
    }

    public async execute(_client: Client, _commandInteraction: CommandInteraction<CacheType>): Promise<void> { return }
    public async init(client: Client<boolean>): Promise<void> { return }
}