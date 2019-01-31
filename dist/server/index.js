"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandRunner_1 = require("../lib/commands/CommandRunner");
const globalConfig_1 = require("../lib/userConfig/globalConfig");
const config_1 = require("../config");
const fs_1 = require("fs");
const http = require("http");
const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
async function startServer() {
    const app = express();
    app.use(bodyParser.json());
    let server;
    let configuration;
    let commandRunner;
    const load = async () => {
        configuration = await globalConfig_1.getGlobalConfig();
        commandRunner = new CommandRunner_1.CommandRunner(configuration, !!commandRunner ? commandRunner.processes : {});
    };
    await load();
    // UI
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    // Execute command on a service
    app.post('/api/command/service', async (req, res) => {
        await load();
        const { command, project, service } = req.body;
        try {
            const result = await commandRunner.runCommandOnService(project, service, command);
            res.send({
                data: result,
            });
        }
        catch (e) {
            res.status(400);
            res.send(e.toString());
        }
    });
    // Execute command on a group
    app.post('/api/command/group', async (req, res) => {
        await load();
        const { command, project, group } = req.body;
        try {
            const result = await commandRunner.runCommandOnGroup(project, group, command);
            res.send({
                data: result
            });
        }
        catch (e) {
            res.status(400);
            res.send(e.toString());
        }
    });
    // Update global configuration
    app.post('/api/config', async (req, res) => {
        const rawConfig = globalConfig_1.getRawGlobalConfig();
        const keys = Object.keys(req.body);
        keys.forEach(key => {
            if (config_1.configurableKeysInConf.indexOf(key) !== -1) {
                rawConfig[key] = req.body[key];
            }
        });
        fs_1.writeFileSync(config_1.globalConfigPath, JSON.stringify(rawConfig, null, 2));
        res.status(204);
        res.send();
    });
    // Shut down the server
    app.post('/api/shutdown', async (req, res) => {
        res.status(202);
        res.send();
        await server.close();
        console.log('Server shut down.');
        process.exit();
    });
    server = http.createServer(app);
    const wss = new WebSocket.Server({ server });
    wss.on('connection', ws => {
        // Close broken connections
        ws['isAlive'] = true;
        ws.on('pong', () => { ws['isAlive'] = true; });
        setInterval(() => {
            if (!ws['isAlive']) {
                ws.terminate();
            }
            else {
                ws['isAlive'] = false;
                try {
                    ws.ping();
                }
                catch (_) {
                    ws.terminate();
                }
            }
        }, 10000);
        ws.on('message', async (message) => {
            const parsedMessage = JSON.parse(message);
            switch (parsedMessage.path) {
                // Get service logs
                case 'logs':
                    await load();
                    const process = commandRunner.processes[parsedMessage.project][parsedMessage.service]
                        .find(process => process.name === parsedMessage.process);
                    if (parsedMessage.fromBeginning === true) {
                        process.logs.forEach(log => ws.send(log.trimRight()));
                    }
                    process.process.stdout.on('data', data => {
                        try {
                            ws.send(data.toString().trimRight());
                        }
                        catch (_) {
                            ws.terminate();
                        }
                    });
                    break;
            }
        });
    });
    // Start the server
    server.listen(configuration.server.port, function () {
        console.log(`Server started, listening port ${configuration.server.port}`);
    });
}
exports.startServer = startServer;
