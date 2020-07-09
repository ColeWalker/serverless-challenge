'use strict';

class InvokeOnDeploy {
  constructor(serverless, options) {
    this.hooks = {
      // this is where we declare the hook we want our code to run
      'after:deploy:deploy': () => {
        console.log('Invoking lambda function')
        invokeLambdaOnDeploy(serverless)
      }
    }
  }
}

async function invokeLambdaOnDeploy(serverless) {
  const provider = serverless.getProvider('aws');

  const params = {
    FunctionName: 'voicefoundry-challenge-dev-savebooks'
  }

  const res = await provider.request('Lambda', 'invoke', params)
  console.log(res)
}

module.exports = InvokeOnDeploy
