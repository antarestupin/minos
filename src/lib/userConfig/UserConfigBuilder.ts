import {projectConfig, rootConfig, serviceConfig, userConfig} from './userConfigTypes';
import {defaultUserProjectConfig} from '../../config';
import defaultCommands from '../commands/defaultCommands';

export class UserConfigBuilder {

  /**
   * Build the configuration from root configuration.
   */
  async build(rootConfig: rootConfig): Promise<userConfig> {
    const projects = await Promise.all(
      rootConfig.projects
        .map(UserConfigBuilder.replaceHomeInPath)
        .map(this.getProjectConfig)
    );

    return {
      ...rootConfig,
      projects,
    };
  }

  /**
   * Build a project configuration from its config file path.
   */
  private async getProjectConfig(path: string): Promise<projectConfig> {
    const projectConfig = await import(path) as projectConfig;

    // TODO: validate config before setting default values

    // default values
    projectConfig.services.map(UserConfigBuilder.serviceConfigWithDefaultValues);

    return projectConfig as projectConfig;
  }

  /**
   * Modify the config to handle shortcuts and default values.
   */
  private static serviceConfigWithDefaultValues(service: serviceConfig): serviceConfig {
    // path
    service.path = UserConfigBuilder.replaceHomeInPath(service.path);

    // repository
    let {repository} = service;
    if (!!repository) {
      // replace shortcut
      if (typeof repository === 'string') {
        repository = {
          url: repository,
        };
      }
      repository = repository as { type: string, url: string; };
      // default value for type
      if (!repository.type) {
        repository.type = defaultUserProjectConfig.repositoryType;
      }
    }
    service.repository = repository;

    // commands
    service.commands = {...defaultCommands, ...service.commands};

    return service;
  }

  /**
   * Replace unsupported ~ by the path to home.
   */
  private static replaceHomeInPath(path: string): string {
    return path.split('/').map(i => i === '~' ? process.env.HOME : i).join('/');
  }
}
