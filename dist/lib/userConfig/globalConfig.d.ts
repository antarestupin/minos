import { rootConfig, userConfig } from './userConfigTypes';
export declare function getRawGlobalConfig(): rootConfig;
export declare function getGlobalConfig(): Promise<userConfig>;
