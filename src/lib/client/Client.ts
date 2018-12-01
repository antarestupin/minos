import {serverConfig} from '../userConfig/userConfigTypes';
import axios, {AxiosResponse} from 'axios';
import WebSocket = require('ws');

export class Client {

  constructor(
    private serverConfig: serverConfig
  ) {}

  /**
   * Send a request to the server.
   */
  private async sendRequest(request: () => Promise<AxiosResponse>): Promise<any> {
    try {
      const response = await request();
      return response.data;
    } catch (e) {
      if (!!e.response) {
        throw e.response.data;
      } else {
        throw `Could not connect to Minos server. Are you sure it's running?`;
      }
    }
  }

  /**
   * Execute given command on a service.
   */
  async executeCommandOnService(command: string, project: string, service: string): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/service`,
      {command, project, service},
    ))).data;
  }

  /**
   * Execute given command on a group.
   */
  async executeCommandOnGroup(command: string, project: string, group: string): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/group`,
      {command, project, group},
    ))).data;
  }

  /**
   * Add changes to the global configuration.
   */
  async changeConfig(newConfig: Object): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/config`,
      newConfig,
    ))).data;
  }

  /**
   * Shut down the local server.
   */
  async shutdown(): Promise<Object> {
    return this.sendRequest(() => axios.post(`http://localhost:${this.serverConfig.port}/api/shutdown`));
  }

  /**
   * Fetch logs for given process of a service.
   */
  async *fetchLogs(project: string, service: string, processName: string, fromBeginning: boolean = true): AsyncIterableIterator<string> {
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
    ws.on('message', (message: string) => {
      buffer.push(message);
    });

    while (true) {
      yield await new Promise<string>(resolve => {
        if (buffer.length > 0) {
          resolve(buffer.shift());
        } else {
          let interval;
          interval = setInterval(() => {
            if (buffer.length > 0) {
              resolve(buffer.shift());
              clearInterval(interval);
            }
          }, 50);
        }
      });
    }
  }
}
