import {userConfig} from '../userConfig/userConfigTypes';
import {ChildProcess, exec} from 'child_process';

export class CommandRunner {

  constructor(
    private configuration: userConfig,

    /** Store of running services processes. */
    public processes: { [project: string]: { [service: string]: ChildProcess[] } } = {}
  ) {}

  /**
   * Run a command on each service of a group.
   */
  async runCommandOnGroup(project: string, group: string, command: string): Promise<{[service: string]: any}> {
    const services = this.configuration
      .projects.filter(({name}) => name === project)[0]
      .groups.filter(({name}) => name === group)[0].services;

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
    const serviceConfig = this.configuration
      .projects.filter(({name}) => name === project)[0]
      .services.filter(({name}) => name === service)[0];

    if (!serviceConfig.commands[command]) {
      return null;
    }

    if (!this.processes[project]) {
      this.processes[project] = {};
    }

    if (!this.processes[project][service]) {
      this.processes[project][service] = [];
    }

    const result = await serviceConfig.commands[command]({
      service: serviceConfig,
      configuration: this.configuration,
      processes: this.processes[project][service],
      exec: bashCommand => this.exec(bashCommand, serviceConfig.path),
      run: bashCommand => this.run(bashCommand, project, service, serviceConfig.path),
      kill: () => {
        this.processes[project][service].forEach(process => process.kill());
        this.processes[project][service] = [];
      },
      cleanProcesses: () => {
        this.processes[project][service] = [];
      },
    });

    return result;
  }

  /**
   * Run a bash command.
   */
  private exec(bashCommand: string, fromPath: string): ChildProcess {
    return exec(bashCommand, {
      cwd: fromPath,
    });
  }

  /**
   * Run a long-running bash command without waiting it to end.
   */
  private run(bashCommand: string, project: string, service: string, fromPath: string): ChildProcess {
    const process = this.exec(bashCommand, fromPath);

    this.processes[project][service].push(process);

    return process;
  }
}
