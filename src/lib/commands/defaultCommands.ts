import {commandArgs} from '../userConfig/userConfigTypes';

const install = ({exec, service}) => exec(`git clone ${service.repository}`);

const build = () => {}; // Do nothing

const stop = ({kill}) => kill();

const restart = (args: commandArgs) => {
  args.service.commands.stop(args);
  args.service.commands.start(args);
};

const isRunning = ({processes}: commandArgs) => processes.length > 0;

const update = ({exec}) => exec(`git checkout master && git pull origin master`);

const isUpToDate = () => {}; // TODO

export default {
  install,
  build,
  stop,
  restart,
  isRunning,
  update,
  isUpToDate,
};
