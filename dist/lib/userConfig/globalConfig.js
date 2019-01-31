"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserConfigBuilder_1 = require("./UserConfigBuilder");
const fs_1 = require("fs");
const config_1 = require("../../config");
/**
 * Get raw global config (before being built).
 */
function getRawGlobalConfig() {
    const rawRootConfig = fs_1.readFileSync(config_1.globalConfigPath, 'utf8');
    return JSON.parse(rawRootConfig);
}
exports.getRawGlobalConfig = getRawGlobalConfig;
/**
 * Get global config (built).
 */
async function getGlobalConfig() {
    const userConfigBuilder = new UserConfigBuilder_1.UserConfigBuilder();
    const rootConfig = getRawGlobalConfig();
    return await userConfigBuilder.build(rootConfig);
}
exports.getGlobalConfig = getGlobalConfig;
