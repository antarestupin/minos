module.exports = {
  name: 'test-project',
  services: [
    {
      name: 'service1',
      path: '~/workspace/github/minos/example/service1',
      commands: {
        build: ({exec}) => {
          return exec('docker help', {splitLine: true});
          // return exec('ls -a');
          return exec('ls -a').then(result => result[0]);
          return exec('ls -a').then(result => result[0].split('\n').filter(i => !!i));
        },
        start: ({run, awaitOutput}) => {
          awaitOutput(run('server', `node ./service1.js`), 'hello: 3', null, 8000)
            .then(() => console.log('ok'))
            .catch(() => console.log('fail'))
        },
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
