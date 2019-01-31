"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const defaultCommands_1 = require("../commands/defaultCommands");
const requireCache_1 = require("./requireCache");
class UserConfigBuilder {
    /**
     * Build the configuration from root configuration.
     */
    async build(rootConfig) {
        rootConfig.projects = rootConfig.projects || [];
        rootConfig.server = rootConfig.server || {};
        rootConfig.server.port = rootConfig.server.port || config_1.defaultServerConf.port;
        const projects = await Promise.all(rootConfig.projects
            .map(UserConfigBuilder.replaceHomeInPath)
            .map(path => {
            requireCache_1.purgeCache(path);
            return path;
        })
            .map(this.getProjectConfig));
        return Object.assign({}, rootConfig, { projects });
    }
    /**
     * Build a project configuration from its config file path.
     */
    async getProjectConfig(path) {
        const projectConfig = await Promise.resolve().then(() => require(path));
        projectConfig.services = projectConfig.services || [];
        projectConfig.groups = projectConfig.groups || [];
        projectConfig.groups.forEach(group => group.services = group.services || []);
        UserConfigBuilder.validateProjectConfig(projectConfig, path);
        // default values
        projectConfig.services.map(UserConfigBuilder.serviceConfigWithDefaultValues);
        return projectConfig;
    }
    /**
     * Validate project configuration.
     */
    static validateProjectConfig(projectConfig, path) {
        if (!projectConfig.name) {
            throw `A project has no name (at path ${path}).`;
        }
        if (!projectConfig.groups.every(group => !!group.name)) {
            throw `A group has no name (in project ${projectConfig.name}).`;
        }
        projectConfig.services.forEach(service => {
            if (!service.name) {
                throw `A service has no name (in project ${projectConfig.name}).`;
            }
            if (!service.path) {
                throw `Service ${service.name} has no path.`;
            }
        });
    }
    /**
     * Modify the config to handle shortcuts and default values.
     */
    static serviceConfigWithDefaultValues(service) {
        // path
        service.path = UserConfigBuilder.replaceHomeInPath(service.path);
        // repository
        let { repository } = service;
        if (!!repository) {
            // replace shortcut
            if (typeof repository === 'string') {
                repository = {
                    url: repository,
                };
            }
            repository = repository;
            // default value for type
            if (!repository.type) {
                repository.type = config_1.defaultUserProjectConfig.repositoryType;
            }
        }
        service.repository = repository;
        // commands
        service.commands = Object.assign({}, defaultCommands_1.default, service.commands);
        return service;
    }
    /**
     * Replace unsupported ~ by the path to home.
     */
    static replaceHomeInPath(path) {
        return path.split('/').map(i => i === '~' ? process.env.HOME : i).join('/');
    }
}
exports.UserConfigBuilder = UserConfigBuilder;
