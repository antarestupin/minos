"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class CommandRunner {
    constructor(configuration, 
    /** Store of running services processes. */
    processes = {}) {
        this.configuration = configuration;
        this.processes = processes;
    }
    /**
     * Run a command on each service of a group.
     */
    async runCommandOnGroup(project, group, command) {
        const projectConfig = this.configuration.projects.find(({ name }) => name === project);
        if (!projectConfig)
            throw `No project ${project} found.`;
        const groupConfig = projectConfig.groups.find(({ name }) => name === group);
        if (!groupConfig)
            throw `No group ${group} found.`;
        const services = groupConfig.services;
        const commandResults = await Promise.all(services.map(service => this.runCommandOnService(project, service, command)));
        const results = {};
        commandResults.forEach((result, index) => results[services[index]] = result);
        return results;
    }
    /**
     * Run a service command with provided context.
     */
    async runCommandOnService(project, service, command) {
        const projectConfig = this.configuration.projects.find(({ name }) => name === project);
        if (!projectConfig)
            throw `No project ${project} found.`;
        const serviceConfig = projectConfig.services.find(({ name }) => name === service);
        if (!serviceConfig)
            throw `No service ${service} found.`;
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
            exec: (bashCommand, { splitLine = true } = { splitLine: true }) => this.exec(bashCommand, serviceConfig.path, splitLine),
            run: (processName, bashCommand) => this.run(bashCommand, project, service, serviceConfig.path, processName),
            awaitOutput: (process, expectedOutput, errorOutput, timeout) => new Promise((resolve, reject) => {
                const timeoutReject = setTimeout(reject, timeout);
                process.stdout.on('data', data => {
                    const convertedData = data.toString();
                    if (convertedData.match(expectedOutput)) {
                        resolve(convertedData);
                        clearTimeout(timeoutReject);
                    }
                    else if (convertedData.match(errorOutput)) {
                        reject(convertedData);
                        clearTimeout(timeoutReject);
                    }
                });
            }),
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
    exec(bashCommand, fromPath, splitLine) {
        const child = child_process_1.exec(bashCommand, {
            cwd: fromPath,
        });
        let output = [];
        child.stdout.on('data', (data) => {
            output.push(splitLine ? data.trim().toString().split('\n') : data.toString());
        });
        if (splitLine) {
            output = [].concat.apply([], output);
        }
        return new Promise((resolve, reject) => {
            child.addListener('error', reject);
            child.addListener('exit', () => resolve(output));
        });
    }
    /**
     * Run a long-running bash command without waiting it to end.
     */
    run(bashCommand, project, service, fromPath, processName) {
        const process = child_process_1.exec(bashCommand, {
            cwd: fromPath,
        });
        const logs = [];
        this.processes[project][service].push({ process, logs, name: processName });
        process.stdout.on('data', data => {
            logs.push(data.toString());
        });
        return process;
    }
}
exports.CommandRunner = CommandRunner;
