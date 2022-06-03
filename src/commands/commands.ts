/* eslint-disable @typescript-eslint/no-empty-function */
import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";

export class GuildSubCommand {
    public readonly commandName: string;
    public readonly description: string;
    public readonly commandBuilder: SlashCommandBuilder = new SlashCommandBuilder();

    constructor(commandName: string, description: string) {
        this.commandName = commandName;
        this.description = description;


        this.commandBuilder
        .setName(this.commandName)
        .setDescription(this.description)
    }

    public async execute(client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {}
}

export class GuildCommand {
    public readonly commandName: string;
    public readonly description: string;
    public readonly commandBuilder: SlashCommandBuilder;
    public readonly subCommands: GuildSubCommand[] = [];

    constructor(commandName: string, description: string) {
        this.commandName = commandName;
        this.description = description;


        this.commandBuilder = new SlashCommandBuilder()
        .setName(this.commandName)
        .setDescription(this.description)
        
    }

    public async init(client: Client): Promise<void> {}
    public async execute(client: Client, commandInteraction: CommandInteraction<CacheType>): Promise<void> {}
}
