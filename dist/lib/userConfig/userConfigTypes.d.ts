/// <reference types="node" />
import { ChildProcess } from 'child_process';
/**
 * The global configuration, before being parsed
 */
export declare type rootConfig = {
    currentProject?: string;
    currentGroup?: string;
    projects: string[];
    server?: serverConfig;
};
/**
 * The parsed configuration
 */
export declare type userConfig = {
    currentProject?: string;
    currentGroup?: string;
    projects: projectConfig[];
    server?: serverConfig;
};
export declare type serverConfig = {
    port?: number;
};
/**
 * Project configuration
 */
export declare type projectConfig = {
    name: string;
    services: serviceConfig[];
    groups: groupConfig[];
};
/**
 * Service configuration
 */
export declare type serviceConfig = {
    name: string;
    path: string;
    repository?: string | {
        type?: string;
        url: string;
    };
    commands: {
        install?: command;
        build?: command;
        start: command;
        stop?: command;
        restart?: command;
        isRunning?: command;
        update?: command;
        isUpToDate?: command;
        [name: string]: command;
    };
};
/**
 * Group configuration
 */
export declare type groupConfig = {
    name: string;
    services: string[];
};
/**
 * Commands return the processes of their tasks
 */
export declare type command = (args: commandArgs) => any;
export declare type commandArgs = {
    service: serviceConfig;
    configuration: userConfig;
    exec: (command: string) => Promise<string[]>;
    run: (processName: string, bashCommand: string) => ChildProcess;
    awaitOutput: (process: ChildProcess, expectedOutput: string | RegExp, errorOutput: string | RegExp, timeout: number) => Promise<null | string>;
    processes: {
        name: string;
        process: ChildProcess;
        logs: string[];
    }[];
    kill: () => void;
    cleanProcesses: () => void;
};
