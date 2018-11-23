"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var install = function (_a) {
    var exec = _a.exec, service = _a.service;
    return exec("git clone " + service.repository);
};
var build = function () { }; // Do nothing
var stop = function (_a) {
    var kill = _a.kill;
    return kill();
};
var restart = function (args) {
    args.service.commands.stop(args);
    args.service.commands.start(args);
};
var isRunning = function (_a) {
    var processes = _a.processes;
    return processes.length > 0;
};
var update = function (_a) {
    var exec = _a.exec;
    return exec("git checkout master && git pull origin master");
};
var isUpToDate = function () { }; // TODO
exports.default = {
    install: install,
    build: build,
    stop: stop,
    restart: restart,
    isRunning: isRunning,
    update: update,
    isUpToDate: isUpToDate,
};
