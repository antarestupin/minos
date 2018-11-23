# Minos

## Commands

- **Install**: `git clone ${repositoryUrl} ${path}` by default
- **Build**: do nothing by default
- **Start**: must be defined
- **Stop**: only kill process by default
- **Restart**: stop & start by default
- **Update**: `git pull origin master` + build by default
- **Is up-to-date**
- **Is running**

Custom commands examples:

- **Pause**: pause Docker containers
- **Clean**: removes everything

## CLI

```
minos init                            # init global / local config file
minos help                            # help
minos config set currentProject project1
minos config set currentGroup project1
minos start group project1:group1     # start all services in group group1
minos start service project1:service1 # start service service1
minos start group group1              # with current project defined on global config
minos start service service1
minos start
```

## Ideas

- Manage project dependencies (git, node, docker...)

