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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Client_1 = require("../lib/client/Client");
var server_1 = require("../server");
var globalConfig_1 = require("../lib/userConfig/globalConfig");
var program = require('commander');
program
    .command('start-server')
    .description('Start local server that will do the job.')
    .action(function () { return server_1.startServer(); });
program
    .command('stop-server')
    .description('Stop the local server.')
    .action(function () { return __awaiter(_this, void 0, void 0, function () {
    var configuration, client, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, globalConfig_1.getGlobalConfig()];
            case 1:
                configuration = _a.sent();
                client = new Client_1.Client(configuration.server);
                return [4 /*yield*/, client.shutdown()];
            case 2:
                _a.sent();
                console.log('Server shut down.');
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program
    .command('set <key> <value>')
    .description('Set a global configuration value.')
    .action(function (key, value) { return __awaiter(_this, void 0, void 0, function () {
    var configuration, client, e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, globalConfig_1.getGlobalConfig()];
            case 1:
                configuration = _b.sent();
                client = new Client_1.Client(configuration.server);
                return [4 /*yield*/, client.changeConfig((_a = {}, _a[key] = value, _a))];
            case 2:
                _b.sent();
                console.log('Configuration updated.');
                return [3 /*break*/, 4];
            case 3:
                e_2 = _b.sent();
                console.log(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
program
    .command('command <command> [targetType] [target]')
    .alias('c')
    .description('Execute the command on every service that implements it in target. [targetType] must be group or service.')
    .action(function (command, type, target) { return __awaiter(_this, void 0, void 0, function () {
    var configuration, client, _a, targetType, project, serviceOrGroup, result, _b, e_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                return [4 /*yield*/, globalConfig_1.getGlobalConfig()];
            case 1:
                configuration = _c.sent();
                client = new Client_1.Client(configuration.server);
                _a = parseTarget(type, target, configuration), targetType = _a.targetType, project = _a.project, serviceOrGroup = _a.serviceOrGroup;
                result = void 0;
                _b = targetType;
                switch (_b) {
                    case 'service': return [3 /*break*/, 2];
                    case 'group': return [3 /*break*/, 4];
                }
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, client.executeCommandOnService(command, project, serviceOrGroup)];
            case 3:
                result = _c.sent();
                return [3 /*break*/, 7];
            case 4: return [4 /*yield*/, client.executeCommandOnGroup(command, project, serviceOrGroup)];
            case 5:
                result = _c.sent();
                return [3 /*break*/, 7];
            case 6: throw "Target type must be either 'service' or 'group'.";
            case 7:
                console.log(JSON.stringify(result, null, 2));
                return [3 /*break*/, 9];
            case 8:
                e_3 = _c.sent();
                console.log(e_3);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
program
    .command('*')
    .action(function () {
    program.help();
});
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
/**
 * Get project and target, with default values from global config.
 */
function parseTarget(targetType, target, configuration) {
    targetType = targetType || 'group';
    target = target || '';
    var _a = target.split(':'), parsedProject = _a[0], parsedServiceOrGroup = _a[1];
    var project = (parsedServiceOrGroup && parsedProject) || configuration.currentProject;
    var serviceOrGroup = parsedServiceOrGroup || parsedProject || configuration.currentGroup;
    if (!project) {
        throw 'Project must be provided.';
    }
    if (!serviceOrGroup) {
        throw 'Service or group must be provided.';
    }
    return {
        targetType: targetType,
        project: project,
        serviceOrGroup: serviceOrGroup,
    };
}
