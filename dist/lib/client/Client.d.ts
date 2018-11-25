import { serverConfig } from '../userConfig/userConfigTypes';
import { AxiosResponse } from 'axios';
export declare class Client {
    private serverConfig;
    constructor(serverConfig: serverConfig);
    sendRequest(request: () => Promise<AxiosResponse>): Promise<any>;
    executeCommandOnService(command: string, project: string, service: string): Promise<Object>;
    executeCommandOnGroup(command: string, project: string, group: string): Promise<Object>;
    changeConfig(newConfig: Object): Promise<Object>;
    shutdown(): Promise<Object>;
}
