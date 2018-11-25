import {serverConfig} from '../userConfig/userConfigTypes';
import axios, {AxiosResponse} from 'axios';

export class Client {

  constructor(
    private serverConfig: serverConfig
  ) {}

  async sendRequest(request: () => Promise<AxiosResponse>): Promise<any> {
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

  async executeCommandOnService(command: string, project: string, service: string): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/service`,
      {command, project, service},
    ))).data;
  }

  async executeCommandOnGroup(command: string, project: string, group: string): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/group`,
      {command, project, group},
    ))).data;
  }

  async changeConfig(newConfig: Object): Promise<Object> {
    return (await this.sendRequest(() => axios.post(
      `http://localhost:${this.serverConfig.port}/api/config`,
      newConfig,
    ))).data;
  }

  async shutdown(): Promise<Object> {
    return this.sendRequest(() => axios.post(`http://localhost:${this.serverConfig.port}/api/shutdown`));
  }
}
