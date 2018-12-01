import { rootConfig, userConfig } from './userConfigTypes';
/**
 * Get raw global config (before being built).
 */
export declare function getRawGlobalConfig(): rootConfig;
/**
 * Get global config (built).
 */
export declare function getGlobalConfig(): Promise<userConfig>;
