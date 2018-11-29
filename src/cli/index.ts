import {Client} from '../lib/client/Client';
import {startServer} from '../server';
import {getGlobalConfig} from '../lib/userConfig/globalConfig';
import {userConfig} from '../lib/userConfig/userConfigTypes';
import {globalConfigPath} from '../config';
import {existsSync, writeFileSync} from 'fs';

const program = require('commander');
const WebSocket = require('ws');

program
  .command('init')
  .description('Create the global configuration file.')
  .action(() => {
    if (!existsSync(globalConfigPath)) {
      writeFileSync(globalConfigPath, JSON.stringify({
        currentProject: '',
        currentGroup: '',
        projects: [],
      }, null, 2));

      console.log(`Configuration file created at ${globalConfigPath}`);
    } else {
      console.log(`Configuration file already exists at ${globalConfigPath}`);
    }
  });

program
  .command('start-server')
  .description('Start local server that will do the job.')
  .action(() => startServer());

program
  .command('stop-server')
  .description('Stop the local server.')
  .action(async () => {
    try {
      const configuration = await getGlobalConfig();
      const client = new Client(configuration.server);

      await client.shutdown();
      console.log('Server shut down.');
    } catch (e) {
      console.log(e);
    }
  });

program
  .command('set <key> <value>')
  .description('Set a global configuration value.')
  .action(async (key, value) => {
    try {
      const configuration = await getGlobalConfig();
      const client = new Client(configuration.server);

      await client.changeConfig({[key]: value});
      console.log('Configuration updated.');
    } catch (e) {
      console.log(e);
    }
  });

program
  .command('command <command> [targetType] [target]')
  .alias('c')
  .description('Execute the command on every service that implements it in target. [targetType] must be group or service.')
  .action(async (command, type, target) => {
    try {
      const configuration = await getGlobalConfig();
      const client = new Client(configuration.server);

      let {targetType, project, serviceOrGroup} = parseTarget(type, target, configuration);

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
    } catch (e) {
      console.log(e);
    }
  });

program
  .command('logs <targetService> <processName>')
  .description('Read target service logs.')
  .action(async (targetService, processName) => {
    try {
      const configuration = await getGlobalConfig();
      const client = new Client(configuration.server);
      let {project, serviceOrGroup} = parseTarget('service', targetService, configuration);

      for await (const log of client.fetchLogs(project, serviceOrGroup, processName)) {
        console.log(log);
      }
    } catch (e) {
      console.log(e);
    }
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
function parseTarget(targetType: string, target: string, configuration: userConfig): {targetType: string, project: string, serviceOrGroup: string;} {
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
