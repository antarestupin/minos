export const globalConfigPath = `${process.env.HOME}/.minos.json`;

export const defaultUserProjectConfig = {
  repositoryType: 'git',
};

export const defaultServerConf = {
  port: 9009,
};

export const configurableKeysInConf = ['currentProject', 'currentGroup'];
