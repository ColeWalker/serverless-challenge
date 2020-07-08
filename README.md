# Assignment

Build a serverless framework (serverless.com) deployment that:

- [x] Creates a Lambda
- [x] Creates an S3 bucket
- [x] Creates a DynamoDB table
- [x] Uploads a file to your bucket

Then, complete the following:

- [x] Write a plugin that invokes the Lambda after the deployment
- [x] Extract data from the file in S3 and insert that data into DynamoDB
- [x] Be creative. Show off. Make it interesting

# The Process

# Dependencies

| Dependency         | Use                                                                     |
| ------------------ | ----------------------------------------------------------------------- |
| serverless-s3-sync | Automatically upload files in the "data" local folder to the S3 bucket. |
| aws-sdk            | Allows interaction with Amazon Web Services                             |

### serverless-s3-sync
