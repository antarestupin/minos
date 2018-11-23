import {rootConfig, userConfig} from './userConfigTypes';
import {UserConfigBuilder} from './UserConfigBuilder';
import {readFileSync} from "fs";
import {globalConfigPath} from '../../config';

export async function getGlobalConfig(): Promise<userConfig> {
  const userConfigBuilder = new UserConfigBuilder();
  const rawRootConfig = readFileSync(globalConfigPath, 'utf8');
  const rootConfig = JSON.parse(rawRootConfig) as rootConfig;

  return await userConfigBuilder.build(rootConfig)
}
