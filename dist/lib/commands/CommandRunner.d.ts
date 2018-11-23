/// <reference types="node" />
import { userConfig } from '../userConfig/userConfigTypes';
import { ChildProcess } from 'child_process';
export declare class CommandRunner {
    private configuration;
    /** Store of running services processes. */
    processes: {
        [project: string]: {
            [service: string]: ChildProcess[];
        };
    };
    constructor(configuration: userConfig, 
        /** Store of running services processes. */
        processes?: {
        [project: string]: {
            [service: string]: ChildProcess[];
        };
    });
    /**
     * Run a command on each service of a group.
     */
    runCommandOnGroup(project: string, group: string, command: string): Promise<{
        [service: string]: any;
    }>;
    /**
     * Run a service command with provided context.
     */
    runCommandOnService(project: string, service: string, command: string): Promise<any>;
    /**
     * Run a bash command.
     */
    private exec(bashCommand, fromPath);
    /**
     * Run a long-running bash command without waiting it to end.
     */
    private run(bashCommand, project, service, fromPath);
}
