const aws = require('aws-sdk')
const lambda = new aws.Lambda({ region: 'us-east-1' })

class OnDeployHook {
  constructor(serverless, options) {
    this.hooks = {
      // this is where we declare the hook we want our code to run
      'after:deploy:finalize': () => {
        invokeLambdaOnDeploy(serverless)
      }
    }
  }
}

async function invokeLambdaOnDeploy(serverless) {
  const params = {
    FunctionName: 'voicefoundry-challenge-dev-savebooks'
  }
  const res = await lambda.invoke(params).promise()
  console.log(res)
}

module.exports = OnDeployHook
