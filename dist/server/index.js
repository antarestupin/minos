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
var CommandRunner_1 = require("../lib/commands/CommandRunner");
var globalConfig_1 = require("../lib/userConfig/globalConfig");
var config_1 = require("../config");
var fs_1 = require("fs");
var express = require('express');
var bodyParser = require('body-parser');
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var app, server, configuration, commandRunner, load;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express();
                    app.use(bodyParser.json());
                    load = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, globalConfig_1.getGlobalConfig()];
                                case 1:
                                    configuration = _a.sent();
                                    commandRunner = new CommandRunner_1.CommandRunner(configuration, !!commandRunner ? commandRunner.processes : {});
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, load()];
                case 1:
                    _a.sent();
                    // UI
                    app.get('/', function (req, res) {
                        res.send('Hello World!');
                    });
                    // Execute command on a service
                    app.post('/api/command/service', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, command, project, service, result;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, load()];
                                case 1:
                                    _b.sent();
                                    _a = req.body, command = _a.command, project = _a.project, service = _a.service;
                                    return [4 /*yield*/, commandRunner.runCommandOnService(project, service, command)];
                                case 2:
                                    result = _b.sent();
                                    res.send({
                                        data: result
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // Execute command on a group
                    app.post('/api/command/group', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, command, project, group, result;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, load()];
                                case 1:
                                    _b.sent();
                                    _a = req.body, command = _a.command, project = _a.project, group = _a.group;
                                    return [4 /*yield*/, commandRunner.runCommandOnGroup(project, group, command)];
                                case 2:
                                    result = _b.sent();
                                    res.send({
                                        data: result
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    // Update global configuration
                    app.post('/api/config', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var rawConfig, keys;
                        return __generator(this, function (_a) {
                            rawConfig = globalConfig_1.getRawGlobalConfig();
                            keys = Object.keys(req.body);
                            keys.forEach(function (key) {
                                if (config_1.configurableKeysInConf.indexOf(key) !== -1) {
                                    rawConfig[key] = req.body[key];
                                }
                            });
                            fs_1.writeFileSync(config_1.globalConfigPath, JSON.stringify(rawConfig, null, 2));
                            res.status(204);
                            res.send();
                            return [2 /*return*/];
                        });
                    }); });
                    // Shut down the server
                    app.post('/api/shutdown', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    res.status(202);
                                    res.send();
                                    return [4 /*yield*/, server.close()];
                                case 1:
                                    _a.sent();
                                    console.log('Server shut down.');
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    server = app.listen(configuration.server.port, function () {
                        console.log("Server started, listening port " + configuration.server.port);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.startServer = startServer;
