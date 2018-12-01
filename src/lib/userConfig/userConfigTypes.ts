import {ChildProcess} from 'child_process';

/**
 * The global configuration, before being parsed
 */
export type rootConfig = {
  currentProject?: string,
  currentGroup?: string,
  projects: string[],
  server?: serverConfig,
};

/**
 * The parsed configuration
 */
export type userConfig = {
  currentProject?: string,
  currentGroup?: string,
  projects: projectConfig[],
  server?: serverConfig,
};

export type serverConfig = {
  port?: number
};

/**
 * Project configuration
 */
export type projectConfig = {
  name: string,
  services: serviceConfig[],
  groups: groupConfig[]
};

/**
 * Service configuration
 */
export type serviceConfig = {
  name: string,
  path: string,
  repository?: string | { // shortcut: url
    type?: string, // default: git
    url: string
  },
  commands: {
    install?: command,
    build?: command,
    start: command,
    stop?: command,
    restart?: command,
    isRunning?: command,
    update?: command,
    isUpToDate?: command,
    [name: string]: command
  }
};

/**
 * Group configuration
 */
export type groupConfig = {
  name: string,
  services: string[]
};

/**
 * Commands return the processes of their tasks
 */
export type command = (args: commandArgs) => any

export type commandArgs = {
  service: serviceConfig,
  configuration: userConfig,
  exec: (command: string) => Promise<string[]>, // execs a short-running bash command and returns every output line produced
  run: (processName: string, bashCommand: string) => ChildProcess, // runs a long-lasting bash command and returns the child process
  processes: {name: string, process: ChildProcess, logs: string[]}[], // processes of running commands,
  kill: () => void,
  cleanProcesses: () => void,
};
