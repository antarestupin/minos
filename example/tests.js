module.exports = {
  name: 'test-project',
  services: [
    {
      name: 'service1',
      path: '~/workspace/github/minos/example/service1',
      commands: {
        build: ({exec}) => {
          return exec('ls -a').then(result => result[0].split('\n').filter(i => !!i));
        },
        start: ({run}) => { run('server', `node ./service1.js`) },
      }
    },
    {
      name: 'service2',
      path: '~/workspace/github/minos/example/service2',
      commands: {
        start: ({run}) => { run('server', `node ./service2.js`) },
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
