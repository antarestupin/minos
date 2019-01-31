"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = ({ exec, service }) => exec(`git clone ${service.repository.url} ${service.path}`);
const install = () => { }; // Do nothing
const build = () => { }; // Do nothing
const stop = ({ kill }) => kill();
const restart = async (args) => {
    await args.service.commands.stop(args);
    return args.service.commands.start(args);
};
const isRunning = ({ processes }) => {
    const result = {};
    processes.forEach(process => {
        result[process.name] = !process.process.killed;
    });
    return result;
};
const update = ({ exec }) => exec(`git checkout master && git pull origin master`);
const isUpToDate = () => { }; // TODO
exports.default = {
    fetch,
    install,
    build,
    stop,
    restart,
    isRunning,
    update,
    isUpToDate,
};
