"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../lib/client/Client");
const server_1 = require("../server");
const globalConfig_1 = require("../lib/userConfig/globalConfig");
const config_1 = require("../config");
const fs_1 = require("fs");
const program = require('commander');
const WebSocket = require('ws');
program
    .command('init')
    .description('Create the global configuration file.')
    .action(() => {
    if (!fs_1.existsSync(config_1.globalConfigPath)) {
        fs_1.writeFileSync(config_1.globalConfigPath, JSON.stringify({
            currentProject: '',
            currentGroup: '',
            projects: [],
        }, null, 2));
        console.log(`Configuration file created at ${config_1.globalConfigPath}`);
    }
    else {
        console.log(`Configuration file already exists at ${config_1.globalConfigPath}`);
    }
});
program
    .command('start-server')
    .description('Start local server that will do the job.')
    .action(() => server_1.startServer());
program
    .command('stop-server')
    .description('Stop the local server.')
    .action(async () => {
    try {
        const configuration = await globalConfig_1.getGlobalConfig();
        const client = new Client_1.Client(configuration.server);
        await client.shutdown();
        console.log('Server shut down.');
    }
    catch (e) {
        console.log(e);
    }
});
program
    .command('set <key> <value>')
    .description('Set a global configuration value.')
    .action(async (key, value) => {
    try {
        const configuration = await globalConfig_1.getGlobalConfig();
        const client = new Client_1.Client(configuration.server);
        await client.changeConfig({ [key]: value });
        console.log('Configuration updated.');
    }
    catch (e) {
        console.log(e);
    }
});
program
    .command('command <command> [targetType] [target]')
    .alias('c')
    .description('Execute the command on every service that implements it in target. [targetType] must be group or service.')
    .action(async (command, type, target) => {
    try {
        const configuration = await globalConfig_1.getGlobalConfig();
        const client = new Client_1.Client(configuration.server);
        let { targetType, project, serviceOrGroup } = parseTarget(type, target, configuration);
        let result;
        switch (targetType) {
            case 'service':
                result = await client.executeCommandOnService(command, project, serviceOrGroup);
                break;
            case 'group':
                result = await client.executeCommandOnGroup(command, project, serviceOrGroup);
                break;
            default:
                throw `Target type must be either 'service' or 'group'.`;
        }
        console.log(JSON.stringify(result, null, 2));
    }
    catch (e) {
        console.log(e);
    }
});
program
    .command('logs <targetService> <processName>')
    .option('--fromNow', 'Only fetch logs from now (skip logs from the beginning)')
    .description('Read target service logs. <processName> is the name of the process as defined by the `run()` helper.')
    .action(async (targetService, processName, cmd) => {
    try {
        const configuration = await globalConfig_1.getGlobalConfig();
        const client = new Client_1.Client(configuration.server);
        let { project, serviceOrGroup } = parseTarget('service', targetService, configuration);
        try {
            for (var _a = __asyncValues(client.fetchLogs(project, serviceOrGroup, processName, !cmd.fromNow)), _b; _b = await _a.next(), !_b.done;) {
                const log = await _b.value;
                console.log(log);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) await _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    catch (e) {
        console.log(e);
    }
    var e_1, _c;
});
program
    .command('*')
    .description('Helper message.')
    .action(() => {
    program.help();
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
/**
 * Get project and target, with default values from global config.
 */
function parseTarget(targetType, target, configuration) {
    targetType = targetType || 'group';
    target = target || '';
    let [parsedProject, parsedServiceOrGroup] = target.split(':');
    const project = (parsedServiceOrGroup && parsedProject) || configuration.currentProject;
    const serviceOrGroup = parsedServiceOrGroup || parsedProject || configuration.currentGroup;
    if (!project) {
        throw 'Project must be provided.';
    }
    if (!serviceOrGroup) {
        throw 'Service or group must be provided.';
    }
    return {
        targetType,
        project,
        serviceOrGroup,
    };
}
