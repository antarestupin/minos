import {serverConfig} from '../userConfig/userConfigTypes';
import axios from 'axios';

export class Client {

  constructor(
    private serverConfig: serverConfig
  ) {}

  async executeCommandOnService(command: string, project: string, service: string): Promise<Object> {
    const response = await axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/service`,
      {command, project, service}
      );

    return response.data.data;
  }

  async executeCommandOnGroup(command: string, project: string, group: string): Promise<Object> {
    const response = await axios.post(
      `http://localhost:${this.serverConfig.port}/api/command/group`,
      {command, project, group}
    );

    return response.data.data;
  }

  async changeConfig(newConfig: Object): Promise<Object> {
    const response = await axios.post(
      `http://localhost:${this.serverConfig.port}/api/config`,
      newConfig
    );

    return response.data.data;
  }

  async shutdown(): Promise<Object> {
    return await axios.post(`http://localhost:${this.serverConfig.port}/api/shutdown`);
  }

}