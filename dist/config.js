"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalConfigPath = process.env.HOME + "/.minos.json";
exports.defaultUserProjectConfig = {
    repositoryType: 'git',
};
exports.defaultServerConf = {
    port: 9009,
};
exports.configurableKeysInConf = ['currentProject', 'currentGroup'];
