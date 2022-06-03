import { CacheType, Client, CommandInteraction } from "discord.js";
import { commandsConfig } from "../../utils/config.js";
import { GuildCommand } from "../commands.js";
import { InviteCancelSubCommand } from "./cancel.js";
import { InviteSendSubCommand } from "./send.js";

export class InviteCommand extends GuildCommand {
    constructor() {
        super(commandsConfig.section.invite.name, commandsConfig.section.invite.description);
    }

    public async execute(_client: Client, CommandInteraction: CommandInteraction<CacheType>): Promise<void> { return }
    public async init(client: Client<boolean>): Promise<void> {
        const sendSubCmd = new InviteSendSubCommand();
        const cancelSubCmd = new InviteCancelSubCommand();

        await sendSubCmd.init(client);
        await cancelSubCmd.init(client);

        this.subCommands.push(
            sendSubCmd,
            cancelSubCmd    
        )

        for(const subCmd of this.subCommands) {
            this.commandBuilder.addSubcommand(subCmd.commandBuilder);
        }
    }
}