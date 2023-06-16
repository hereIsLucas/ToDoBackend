const swaggerAutogen = require('swagger-autogen')()
const outputFile = './swagger-output.json'
const endpointsFiles = ['./taskManager.js']
const config = {
  info: {
    title: 'Clap goof y cheeks',
    description: 'We are a big chicken farm'
  },
  host: 'localhost:3000',
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api-key',
      in: 'header'
    }
  },
  schemes: ['http'],
  definitions: {
    'server side error': {
      $status: 'ERROR',
      $msg: 'some error message',
      error: {
        $message: 'Error message caught',
        $name: 'Error name',
        stack: 'Error stack'
      }
    },
    calculation: {
      $createdAt: '2020-03-31T00:00:00.000Z',
      $result: 100
    }
  }
}
swaggerAutogen(outputFile, endpointsFiles, config).then(async () => {
  await import('./taskManager.js') // Your express api project's root file where the server starts
})
