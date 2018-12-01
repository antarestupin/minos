import { serverConfig } from '../userConfig/userConfigTypes';
export declare class Client {
    private serverConfig;
    constructor(serverConfig: serverConfig);
    /**
     * Send a request to the server.
     */
    private sendRequest(request);
    /**
     * Execute given command on a service.
     */
    executeCommandOnService(command: string, project: string, service: string): Promise<Object>;
    /**
     * Execute given command on a group.
     */
    executeCommandOnGroup(command: string, project: string, group: string): Promise<Object>;
    /**
     * Add changes to the global configuration.
     */
    changeConfig(newConfig: Object): Promise<Object>;
    /**
     * Shut down the local server.
     */
    shutdown(): Promise<Object>;
    /**
     * Fetch logs for given process of a service.
     */
    fetchLogs(project: string, service: string, processName: string, fromBeginning?: boolean): AsyncIterableIterator<string>;
}
