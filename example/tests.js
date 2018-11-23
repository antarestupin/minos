module.exports = {
  name: 'test-project',
  services: [
    {
      name: 'service1',
      path: '~/workspace/github/minos/example/service1',
      commands: {
        build: ({exec}) => { exec(`ls`) },
        start: ({run}) => { run(`node ./service1.js`) },
      }
    },
    {
      name: 'service2',
      path: '~/workspace/github/minos/example/service2',
      commands: {
        build: ({exec}) => { exec(`ls`) },
        start: ({run}) => { run(`node ./service2.js`) },
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
