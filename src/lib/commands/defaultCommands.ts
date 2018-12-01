import {commandArgs} from '../userConfig/userConfigTypes';

const install = ({exec, service}) => exec(`git clone ${service.repository}`);

const build = () => {}; // Do nothing

const stop = ({kill}) => kill();

const restart = async (args: commandArgs) => {
  await args.service.commands.stop(args);
  return args.service.commands.start(args);
};

const isRunning = ({processes}: commandArgs) => {
  const result = {};
  processes.forEach(process => {
    result[process.name] = !process.process.killed;
  });
  return result;
};

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
