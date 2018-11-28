import {userConfig} from '../userConfig/userConfigTypes';
import {ChildProcess, exec} from 'child_process';

export class CommandRunner {

  constructor(
    private configuration: userConfig,

    /** Store of running services processes. */
    public processes: { [project: string]: { [service: string]: {process: ChildProcess, logs: string[]}[] } } = {},
  ) {}

  /**
   * Run a command on each service of a group.
   */
  async runCommandOnGroup(project: string, group: string, command: string): Promise<{[service: string]: any}> {
    let services;
    try {
      services = this.configuration
        .projects.filter(({name}) => name === project)[0]
        .groups.filter(({name}) => name === group)[0].services;
    } catch (e) {
      if (e.message.indexOf('groups') !== -1) {
        throw `No project ${project} found.`;
      } else if (e.message.indexOf('services') !== -1) {
        throw `No group ${group} found.`;
      } else {
        throw e.message;
      }
    }

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
    let serviceConfig;
    try {
      serviceConfig = this.configuration
        .projects.filter(({name}) => name === project)[0]
        .services.filter(({name}) => name === service)[0];
    } catch (e) {
      if (e.indexOf('services') !== -1) {
        throw `No project ${project} found.`;
      } else {
        throw e;
      }
    }

    if (!serviceConfig) {
      throw `No service ${service} found.`;
    }

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
      exec: bashCommand => this.exec(bashCommand, serviceConfig.path),
      run: bashCommand => this.run(bashCommand, project, service, serviceConfig.path),
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
  private run(bashCommand: string, project: string, service: string, fromPath: string): ChildProcess {
    const process = exec(bashCommand, {
      cwd: fromPath,
    });

    const logs = [];
    this.processes[project][service].push({process, logs});
    process.stdout.on('data', data => {
      logs.push(data.toString());
    });
    process.stdout.on('exit', () => console.log(`Service ${service} finished starting`));

    return process;
  }
}
