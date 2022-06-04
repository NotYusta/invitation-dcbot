// TODO: complete configuration

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { CommandsConfig, MainConfig } from '../typings/config';

class Config<T> {
    public readonly path: string;
    public readonly section: T
    constructor(confPath: string) {
        this.path = path.resolve(confPath);
        this.section = yaml.load(fs.readFileSync(this.path, 'utf8')) as T;
    }
}

export const mainConfig = new Config<MainConfig>('./config.yml')
export const commandsConfig = new Config<CommandsConfig>('./commands.yml')
commandsConfig.section.invite.cooldown = commandsConfig.section.invite.cooldown * 1000