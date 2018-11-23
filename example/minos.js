
const projectPath = '~/workspace/my-project';
const gitOrganisationUrl = 'https://github.com/my-org';

// Services
const serviceConfig = name => ({
  name: name,
  path: `${projectPath}/${name}`,
  repository: `${gitOrganisationUrl}/${name}.git`,
  commands: {
    build: ({exec}) => exec(`make build`),
    start: ({exec}) => exec(`make start`),
    stop: ({exec}) => exec(`make stop`),
  }
});

// Website
const websiteName = 'website';
const websiteConfig = {
  name: websiteName,
  path: `${projectPath}/${websiteName}`,
  repository: `${gitOrganisationUrl}/${websiteName}.git`,
  commands: {
    build: ({exec}) => exec(`npm run build`),
    start: ({exec}) => exec(`npm run dev`),
  }
};

module.exports = {
  name: 'my-project',
  services: [
    serviceConfig('auth-service'),
    serviceConfig('chat-service'),
    serviceConfig('billing-service'),
    websiteConfig,
  ],
  groups: [
    {
      name: 'chat',
      services: ['website', 'auth-service', 'chat-service']
    },
    {
      name: 'billing',
      services: ['auth-service', 'billing-service']
    }
  ]
};
