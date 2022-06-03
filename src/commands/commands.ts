/* eslint-disable @typescript-eslint/no-empty-function */
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CacheType, Client, CommandInteraction } from "discord.js";

export class GuildSubCommand {
    public readonly commandName: string;
    public readonly description: string;
    public readonly commandBuilder: SlashCommandSubcommandBuilder = new SlashCommandSubcommandBuilder();

    constructor(commandName: string, description: string) {
        this.commandName = commandName;
        this.description = description;


        this.commandBuilder
        .setName(this.commandName)
        .setDescription(this.description)
    }

    public async execute(_client: Client, _commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async init(_client: Client): Promise<void> {
        throw new Error("Method not implemented.");
    }
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

    public async init(_client: Client): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async execute(_client: Client, _commandInteraction: CommandInteraction<CacheType>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
