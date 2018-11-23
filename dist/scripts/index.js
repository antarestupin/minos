"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserConfigBuilder_1 = require("../lib/userConfig/UserConfigBuilder");
var fs_1 = require("fs");
var CommandRunner_1 = require("../lib/commands/CommandRunner");
var userConfigBuilder = new UserConfigBuilder_1.UserConfigBuilder();
var rawRootConfig = fs_1.readFileSync('./example/.minos.json', 'utf8');
var rootConfig = JSON.parse(rawRootConfig);
userConfigBuilder.build(rootConfig).then(function (conf) {
    var commandRunner = new CommandRunner_1.CommandRunner(conf);
    commandRunner.runCommandOnGroup('test-project', 'group1', 'start');
});
