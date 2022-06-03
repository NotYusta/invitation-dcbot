// TODO: complete configuration

import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { YamlConfig } from '../typings/config';
import logger from './logger.js';

export const configPath = path.resolve('./config.yml');
export const configFile = fs.readFileSync(configPath, 'utf8'); 
export const configSection = yaml.load(configFile) as YamlConfig;

logger.debug("Loaded config: " + configPath);
