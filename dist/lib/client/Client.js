"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const WebSocket = require("ws");
class Client {
    constructor(serverConfig) {
        this.serverConfig = serverConfig;
    }
    /**
     * Send a request to the server.
     */
    async sendRequest(request) {
        try {
            const response = await request();
            return response.data;
        }
        catch (e) {
            if (!!e.response) {
                throw e.response.data;
            }
            else {
                throw `Could not connect to Minos server. Are you sure it's running?`;
            }
        }
    }
    /**
     * Execute given command on a service.
     */
    async executeCommandOnService(command, project, service) {
        return (await this.sendRequest(() => axios_1.default.post(`http://localhost:${this.serverConfig.port}/api/command/service`, { command, project, service }))).data;
    }
    /**
     * Execute given command on a group.
     */
    async executeCommandOnGroup(command, project, group) {
        return (await this.sendRequest(() => axios_1.default.post(`http://localhost:${this.serverConfig.port}/api/command/group`, { command, project, group }))).data;
    }
    /**
     * Add changes to the global configuration.
     */
    async changeConfig(newConfig) {
        return (await this.sendRequest(() => axios_1.default.post(`http://localhost:${this.serverConfig.port}/api/config`, newConfig))).data;
    }
    /**
     * Shut down the local server.
     */
    async shutdown() {
        return this.sendRequest(() => axios_1.default.post(`http://localhost:${this.serverConfig.port}/api/shutdown`));
    }
    /**
     * Fetch logs for given process of a service.
     */
    fetchLogs(project, service, processName, fromBeginning = true) {
        return __asyncGenerator(this, arguments, function* fetchLogs_1() {
            const ws = new WebSocket(`ws://localhost:${this.serverConfig.port}`);
            ws.on('open', () => {
                const message = {
                    path: 'logs',
                    project,
                    service,
                    process: processName,
                    fromBeginning,
                };
                ws.send(JSON.stringify(message));
            });
            const buffer = [];
            ws.on('message', (message) => {
                buffer.push(message);
            });
            while (true) {
                yield yield __await(new Promise(resolve => {
                    if (buffer.length > 0) {
                        resolve(buffer.shift());
                    }
                    else {
                        let interval;
                        interval = setInterval(() => {
                            if (buffer.length > 0) {
                                resolve(buffer.shift());
                                clearInterval(interval);
                            }
                        }, 50);
                    }
                }));
            }
        });
    }
}
exports.Client = Client;
