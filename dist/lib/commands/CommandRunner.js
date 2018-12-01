"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var CommandRunner = /** @class */ (function () {
    function CommandRunner(configuration, 
    /** Store of running services processes. */
    processes) {
        if (processes === void 0) { processes = {}; }
        this.configuration = configuration;
        this.processes = processes;
    }
    /**
     * Run a command on each service of a group.
     */
    CommandRunner.prototype.runCommandOnGroup = function (project, group, command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var projectConfig, groupConfig, services, commandResults, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectConfig = this.configuration.projects.find(function (_a) {
                            var name = _a.name;
                            return name === project;
                        });
                        if (!projectConfig)
                            throw "No project " + project + " found.";
                        groupConfig = projectConfig.groups.find(function (_a) {
                            var name = _a.name;
                            return name === group;
                        });
                        if (!groupConfig)
                            throw "No group " + group + " found.";
                        services = groupConfig.services;
                        return [4 /*yield*/, Promise.all(services.map(function (service) { return _this.runCommandOnService(project, service, command); }))];
                    case 1:
                        commandResults = _a.sent();
                        results = {};
                        commandResults.forEach(function (result, index) { return results[services[index]] = result; });
                        return [2 /*return*/, results];
                }
            });
        });
    };
    /**
     * Run a service command with provided context.
     */
    CommandRunner.prototype.runCommandOnService = function (project, service, command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var projectConfig, serviceConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projectConfig = this.configuration.projects.find(function (_a) {
                            var name = _a.name;
                            return name === project;
                        });
                        if (!projectConfig)
                            throw "No project " + project + " found.";
                        serviceConfig = projectConfig.services.find(function (_a) {
                            var name = _a.name;
                            return name === service;
                        });
                        if (!serviceConfig)
                            throw "No service " + service + " found.";
                        // don't run commands that are not defined
                        if (!serviceConfig.commands[command]) {
                            return [2 /*return*/, null];
                        }
                        this.processes[project] = this.processes[project] || {};
                        this.processes[project][service] = this.processes[project][service] || [];
                        // don't run again services already running
                        if (command === 'start' && this.processes[project][service].length > 0) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, serviceConfig.commands[command]({
                                service: serviceConfig,
                                configuration: this.configuration,
                                processes: this.processes[project][service],
                                exec: function (bashCommand) { return _this.exec(bashCommand, serviceConfig.path); },
                                run: function (processName, bashCommand) { return _this.run(bashCommand, project, service, serviceConfig.path, processName); },
                                kill: function () {
                                    _this.processes[project][service].forEach(function (process) { return process.process.kill(); });
                                    _this.processes[project][service] = [];
                                },
                                cleanProcesses: function () {
                                    _this.processes[project][service] = [];
                                },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Run a bash command.
     */
    CommandRunner.prototype.exec = function (bashCommand, fromPath) {
        var child = child_process_1.exec(bashCommand, {
            cwd: fromPath,
        });
        var output = [];
        child.stdout.on('data', function (data) {
            output.push(data);
        });
        return new Promise(function (resolve, reject) {
            child.addListener('error', reject);
            child.addListener('exit', function () { return resolve(output); });
        });
    };
    /**
     * Run a long-running bash command without waiting it to end.
     */
    CommandRunner.prototype.run = function (bashCommand, project, service, fromPath, processName) {
        var process = child_process_1.exec(bashCommand, {
            cwd: fromPath,
        });
        var logs = [];
        this.processes[project][service].push({ process: process, logs: logs, name: processName });
        process.stdout.on('data', function (data) {
            logs.push(data.toString());
        });
        return process;
    };
    return CommandRunner;
}());
exports.CommandRunner = CommandRunner;
