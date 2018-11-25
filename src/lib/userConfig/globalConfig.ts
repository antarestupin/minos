import {rootConfig, userConfig} from './userConfigTypes';
import {UserConfigBuilder} from './UserConfigBuilder';
import {readFileSync} from "fs";
import {globalConfigPath} from '../../config';

export function getRawGlobalConfig(): rootConfig {
  const rawRootConfig = readFileSync(globalConfigPath, 'utf8');
  return JSON.parse(rawRootConfig) as rootConfig;
}

export async function getGlobalConfig(): Promise<userConfig> {
  const userConfigBuilder = new UserConfigBuilder();
  const rootConfig = getRawGlobalConfig();
  return await userConfigBuilder.build(rootConfig)
}
