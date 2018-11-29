import { commandArgs } from '../userConfig/userConfigTypes';
declare const _default: {
    install: ({ exec, service }: {
        exec: any;
        service: any;
    }) => any;
    build: () => void;
    stop: ({ kill }: {
        kill: any;
    }) => any;
    restart: (args: commandArgs) => void;
    isRunning: ({ processes }: commandArgs) => {};
    update: ({ exec }: {
        exec: any;
    }) => any;
    isUpToDate: () => void;
};
export default _default;
