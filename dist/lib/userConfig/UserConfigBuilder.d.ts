import { rootConfig, userConfig } from './userConfigTypes';
export declare class UserConfigBuilder {
    /**
     * Build the configuration from root configuration.
     */
    build(rootConfig: rootConfig): Promise<userConfig>;
    /**
     * Build a project configuration from its config file path.
     */
    private getProjectConfig(path);
    /**
     * Modify the config to handle shortcuts and default values.
     */
    private static serviceConfigWithDefaultValues(service);
    /**
     * Replace unsupported ~ by the path to home.
     */
    private static replaceHomeInPath(path);
}
