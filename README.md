# Minos

## Install

Not yet registered.

```
npm i -g xxx
```

The following command will create the global configuration file `~/.minos.json`:

```
minos init
```

## How to use

First define your project in a project configuration file anywhere (let's call it `minos.js`):

```js
module.exports = {
  name: 'my-project',
  services: [
    {
      name: 'service1',
      path: '~/workspace/my-project/service1',
      // the repository is optional
      repository: 'https://github.com/my-project/service1.git',
      // at least `start` must be defined, other commands are optional
      commands: {
        build: ({exec}) => { exec('npm run build'); }, // `exec` runs a short-running task
        start: ({run}) => { run(`npm run start`); }, // `run` runs a long-running task
      }
    },
    {
      name: 'service2',
      path: '~/workspace/my-project/service2',
      repository: 'https://github.com/my-project/service2.git',
      commands: {
        build: ({exec}) => { exec('docker-compose build'); },
        start: ({run}) => { run(`docker-compose run`); },
      }
    }
  ],
  groups: [
    {
      name: 'group1',
      services: ['service1', 'service2']
    }
  ]
};
```

Then add the path to this file in the global configuration `~/.minos.json`:

```json
{
  "currentProject": "",
  "currentGroup": "",
  "projects": [
    "~/workspace/my-project/minos.js"
  ]
}
```

You then need to start the Minos server:

```
minos start-server &
```

You can now run the following commands:

```
minos c build group my-project:group1
minos c start group my-project:group1
```

`c` is a alias of `command`. It runs given command on every service of the group `group1`.

When you are working on this project you can specify it in the global configuration:

```
{
  "currentProject": "my-project",
  "currentGroup": "group1",
  "projects": [
    "~/workspace/my-project/minos.js"
  ]
}
```

Alternatively, you can use the following commands:

```
minos set currentProject my-project
minos set currentGroup group1
```

You now can use commands without specifying the target:

```
minos c start
```

You can also target only one service:

```
minos c start service my-project:service1
minos c start service service1 # the project is optional as defined as currentProject
```

## Commands

These are the default commands:

- `install`: Install the service from the remote source; `git clone ${repositoryUrl} ${path}` by default
- `build`: Build the service; do nothing by default
- `start`: Start the service; must be defined
- `stop`: Stop the service; kill the running processes by default
- `isRunning`: Says if the service is running; checks running instances by default
- `restart`: Restart the service; stop & start by default
- `update`: Update the service from the remote source; `git pull origin master` + build by default
- `isUpToDate`: Says if the service is up to date; default behavior not defined yet

You can also add custom commands. Here are some examples:

- `pause`: pause Docker containers
- `clean`: removes everything
