import {Client} from '../lib/client/Client';
import {startServer} from '../server';
import {getGlobalConfig} from '../lib/userConfig/globalConfig';
import {userConfig} from '../lib/userConfig/userConfigTypes';

const program = require('commander');

program
  .command('start-server')
  .description('Start local server that will do the job.')
  .action(() => startServer());

program
  .command('stop-server')
  .description('Stop the local server.')
  .action(async () => {
    const configuration = await getGlobalConfig();
    const client = new Client(configuration.server);
    await client.shutdown();
    console.log('Server shut down.');
  });

program
  .command('command <command> [targetType] [target]')
  .alias('c')
  .description('Execute the command on every service that implements it in target.')
  .action(async (command, type, target) => {
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
  });

program.parse(process.argv);

/**
 * Get project and target, with default values from global config.
 */
function parseTarget(targetType: string, target: string, configuration: userConfig): {targetType: string, project: string, serviceOrGroup: string} {
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
