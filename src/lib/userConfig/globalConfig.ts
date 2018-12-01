import {rootConfig, userConfig} from './userConfigTypes';
import {UserConfigBuilder} from './UserConfigBuilder';
import {readFileSync} from "fs";
import {globalConfigPath} from '../../config';

/**
 * Get raw global config (before being built).
 */
export function getRawGlobalConfig(): rootConfig {
  const rawRootConfig = readFileSync(globalConfigPath, 'utf8');
  return JSON.parse(rawRootConfig) as rootConfig;
}

/**
 * Get global config (built).
 */
export async function getGlobalConfig(): Promise<userConfig> {
  const userConfigBuilder = new UserConfigBuilder();
  const rootConfig = getRawGlobalConfig();
  return await userConfigBuilder.build(rootConfig)
}
