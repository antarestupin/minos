import {userConfig} from '../userConfig/userConfigTypes';
import {ChildProcess, exec} from 'child_process';

export class CommandRunner {

  constructor(
    private configuration: userConfig,

    /** Store of running services processes. */
    public processes: { [project: string]: { [service: string]: {name: string, process: ChildProcess, logs: string[]}[] } } = {},
  ) {}

  /**
   * Run a command on each service of a group.
   */
  async runCommandOnGroup(project: string, group: string, command: string): Promise<{[service: string]: any}> {
    const projectConfig = this.configuration.projects.find(({name}) => name === project);
    if (!projectConfig) throw `No project ${project} found.`;
    const groupConfig = projectConfig.groups.find(({name}) => name === group);
    if (!groupConfig) throw `No group ${group} found.`;
    const services = groupConfig.services;

    const commandResults = await Promise.all(
      services.map(service => this.runCommandOnService(project, service, command))
    );

    const results = {};
    commandResults.forEach((result, index) => results[services[index]] = result);

    return results;
  }

  /**
   * Run a service command with provided context.
   */
  async runCommandOnService(project: string, service: string, command: string): Promise<any> {
    const projectConfig = this.configuration.projects.find(({name}) => name === project);
    if (!projectConfig) throw `No project ${project} found.`;
    const serviceConfig = projectConfig.services.find(({name}) => name === service);
    if (!serviceConfig) throw `No service ${service} found.`;

    // don't run commands that are not defined
    if (!serviceConfig.commands[command]) {
      return null;
    }

    this.processes[project] = this.processes[project] || {};
    this.processes[project][service] = this.processes[project][service] || [];

    // don't run again services already running
    if (command === 'start' && this.processes[project][service].length > 0) {
      return null;
    }

    return await serviceConfig.commands[command]({
      service: serviceConfig,
      configuration: this.configuration,
      processes: this.processes[project][service],
      exec: (bashCommand) => this.exec(bashCommand, serviceConfig.path),
      run: (processName, bashCommand) => this.run(bashCommand, project, service, serviceConfig.path, processName),
      kill: () => {
        this.processes[project][service].forEach(process => process.process.kill());
        this.processes[project][service] = [];
      },
      cleanProcesses: () => {
        this.processes[project][service] = [];
      },
    });
  }

  /**
   * Run a bash command.
   */
  private exec(bashCommand: string, fromPath: string): Promise<string[]> {
    const child = exec(bashCommand, {
      cwd: fromPath,
    });

    let output = [];
    child.stdout.on('data', (data) => {
      output.push(data);
    });

    return new Promise((resolve, reject) => {
      child.addListener('error', reject);
      child.addListener('exit', () => resolve(output));
    });
  }

  /**
   * Run a long-running bash command without waiting it to end.
   */
  private run(bashCommand: string, project: string, service: string, fromPath: string, processName: string): ChildProcess {
    const process = exec(bashCommand, {
      cwd: fromPath,
    });

    const logs = [];
    this.processes[project][service].push({process, logs, name: processName});
    process.stdout.on('data', data => {
      logs.push(data.toString());
    });

    return process;
  }
}
