import {CommandRunner} from '../lib/commands/CommandRunner';
import {getGlobalConfig} from '../lib/userConfig/globalConfig';
import {Server} from 'http';
import {userConfig} from '../lib/userConfig/userConfigTypes';

const express = require('express');
const bodyParser = require('body-parser');

export async function startServer() {
  const app = express();
  app.use(bodyParser.json());

  let server: Server;
  let configuration: userConfig;
  let commandRunner: CommandRunner;

  const load = async () => {
    configuration = await getGlobalConfig();
    commandRunner = new CommandRunner(configuration, !!commandRunner ? commandRunner.processes : {});
  };
  await load();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.post('/api/command/service', async (req, res) => {
    await load();
    const {command, project, service} = req.body;
    const result = await commandRunner.runCommandOnService(project, service, command);
    res.send({
      data: result
    });
  });

  app.post('/api/command/group', async (req, res) => {
    await load();
    const {command, project, group} = req.body;
    const result = await commandRunner.runCommandOnGroup(project, group, command);
    res.send({
      data: result
    });
  });

  app.post('/api/shutdown', async (req, res) => {
    res.send('Shutting down.');
    await server.close();
    console.log('Server shut down.');
  });

  server = app.listen(configuration.server.port, function () {
    console.log(`Server started, listening port ${configuration.server.port}`);
  });
}
