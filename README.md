# Minos

Minos is a tool to ease local development by allowing you to define your projects services and how to run them in a
declarative way. You can them pack them by groups and run commands on all them at once.

## Introduction

### Why Minos

Minos is born from the frustration of managing by hand the launch and stop of several services again and again when
working with a bunch of them, and the lack of tools flexible enough to allow their users to hack their install for custom
needs (e.g. modify a docker-compose.yml to export some service ports), while staying declarative.

### How it works

There are two main components in Minos:

- The configuration, that you define with JS files to describe the projects you work on and their services
- The server, that runs locally to manage the services and apply user-defined commands on them

The server exposes an HTTP and WebSocket interface that can be used by a CLI tool or a GUI for example. A Typescript /
Javascript client is also provided to ease the interactions with the server.

## Install

Not yet registered in npm.

```
npm i -g xxx
```

Then run the following command, which will create the global configuration file `~/.minos.json` with proper file accesses:

```
minos init
```

## Quick start

After the `npm install` and `minos init`, you can start to define our first project.

Let's say we want to create a chat application. This app is split in two services, one for authentication and one
for the chatting system.

### Define the project configuration

First define our project in a project configuration file anywhere (let's call it `minos.js`):

```js
module.exports = {
  name: 'chat-app',
  services: [
    // the chat service
    {
      name: 'chat',
      path: '~/workspace/chat-app/service1',
      // the repository is optional, but allows more commands to be executed on the service
      repository: 'https://github.com/chat-app/chat.git',
      // at least `start` must be defined, other commands are optional
      commands: {
        build: ({exec}) => { exec('npm run build'); }, // `exec` runs a short-running task
        start: ({run}) => { run('server', 'npm run start'); }, // `run` runs a long-running task; the process is named 'server'
      }
    },
    // the authentication service
    {
      name: 'auth',
      path: '~/workspace/chat-app/auth',
      repository: 'https://github.com/chat-app/auth.git',
      commands: {
        build: ({exec}) => { exec('docker-compose build'); },
        start: ({run}) => { run('server', 'docker-compose run'); },
      }
    }
  ],
  groups: [
    {
      name: 'backend',
      services: ['chat', 'auth']
    }
  ]
};
```

Note that defining the configuration in JS allows you more flexibility than a static format as JSON. For example, if
some of your services respect a pattern, you can use a function to define a service's configuration based on a few
parameters, like its name.

Here, we defined the configuration of our project named 'chat-app' with the two services. We also defined a group, named
'backend', that will allow us to run commands to both the services in one line.

By default the server runs on port 9009, but this can be defined in the configuration.

### Add the project configuration in the global configuration

Now, add the path to this file in the global configuration `~/.minos.json`:

```json
{
  "currentProject": "",
  "currentGroup": "",
  "projects": [
    "~/workspace/chat-app/minos.js"
  ]
}
```

### Start the Minos server

You then need to start the Minos server:

```
minos start-server &
```

The server will handle the services and commands to apply to them. It exposes an HTTP interface that your next commands
will use.

### Start the services

You can now run the following commands:

```
minos c build group chat-app:backend
minos c start group chat-app:backend
```

`c` is a alias of `command`. It runs given command on every service of the group `backend`.

### Set a project as your current project

When you are working on this project you can specify it in the global configuration:

```json
{
  "currentProject": "chat-app",
  "currentGroup": "backend",
  "projects": [
    "~/workspace/my-project/minos.js"
  ]
}
```

Alternatively, you can use the following commands:

```
minos set currentProject chat-app
minos set currentGroup backend
```

You now can use commands without specifying the target:

```
minos c start
```

You can also target only one service:

```
minos c start service chat-app:auth
minos c start service auth # the project is optional as it's defined as currentProject
```

## Commands

### Integrated commands and custom commands

These are the commands integrated out of the box:

| Command | Effect | Default |
| ------- | ------ | ------- |
| `fetch`      | Fetch the service from the remote source | `git clone ${repositoryUrl} ${path}` |
| `install`    | Install the service locally; typically what you should do only once to setup the service | Does nothing |
| `build`      | Build the service; things like importing dependencies, building Docker containers... | Does nothing |
| `start`      | Start the service | |
| `stop`       | Stop the service | Kills the running processes; think to use `cleanProcesses` when defining it yourself |
| `isRunning`  | Say if the service is running | Checks running instances |
| `restart`    | Restart the service | `stop` & `start` |
| `update`     | Update the service from the remote source | `git checkout master && git pull origin master` |
| `isUpToDate` | Say if the service is up to date | Not done yet, should compare current and remote master branches |

The `start` command is the only one that must be defined by the user, every other ones will have a default behavior but
can be overridden (for example the `build` command may commonly be used to install dependencies).

You can also add custom commands. Here are some examples:

- `pause`: pause Docker containers
- `clean`: removes everything

If you attempt to call a command on a service that don't have a definition for it, it will do nothing.

### Command helpers

When you define a command for a service, a bunch of helpers are included in the first argument of the command's lambda.
Here they are:

| Helper | Effect |
| ------ | ------ |
| `service`                                                     | The service configuration |
| `configuration`                                               | The global configuration, from the root |
| `processes`                                                   | The list of running processes for the service |
| `exec(bashCommand: string): Promise<string[]>`                | Executes given short-running command from the service path, like `ls` and returns every output line produced |
| `run(processName: string, bashCommand: string): ChildProcess` | Runs given long-lasting command from the service path, like `npm run start` |
| `awaitOutput(process: ChildProcess, expectedOutput: string/RegExp, errorOutput: string/RegExp, timeout: number): Promise<null/string>` | Awaits for `expectedOutput` before processing the next step; fails at `errorOutput` or at timeout |
| `kill(): void`                                                | Kills running processes of the service; no need to call `cleanProcesses` if you run `kill` |
| `cleanProcesses(): void`                                      | Empties the list of running processes for the service; note it doesn't kill them, `kill` does |

Note that your commands should return a value **only** if you want it to be returned. For example, if you return the result
of `run`, which is a Node child process, the server will then attempt to JSON-encode it and crash.

## Minos commands

```
Commands:
  init                                          Create the global configuration file.
  start-server                                  Start local server that will do the job.
  stop-server                                   Stop the local server.
  set <key> <value>                             Set a global configuration value.
  command|c <command> [targetType] [target]     Execute the command on every service that implements it in target. [targetType] must be group or service.
  logs [options] <targetService> <processName>  Read target service logs. <processName> is the name of the process as defined by the `run()` helper.
  *                                             Helper message.
```

The `logs` command also has an optional flag:

- `--fromNow`: Only fetch logs from now (skip logs from the beginning)

## Global configuration

The global configuration has the following shape:

```json
{
  "currentProject": "", // current project
  "currentGroup": "", // current group
  "projects": [ // list of project configurations
    "~/path/to/minos-config.js"
  ],
  "server": { // optional, server configuration
    "port": 9009
  }
}
```
