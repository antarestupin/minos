import { commandArgs } from '../userConfig/userConfigTypes';
declare const _default: {
    fetch: ({ exec, service }: {
        exec: any;
        service: any;
    }) => any;
    install: () => void;
    build: () => void;
    stop: ({ kill }: {
        kill: any;
    }) => any;
    restart: (args: commandArgs) => Promise<any>;
    isRunning: ({ processes }: commandArgs) => {};
    update: ({ exec }: {
        exec: any;
    }) => any;
    isUpToDate: () => void;
};
export default _default;
