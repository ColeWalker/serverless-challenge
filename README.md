# Assignment

Build a serverless framework (serverless.com) deployment that creates:

- A Lambda ✅
- An S3 bucket ✅
- A Dynamo DB table ✅

and uploads a file to your bucket. Then, write a plugin that invokes the Lambda after the deployment, extracts data from the file in S3 and inserts that data into DynamoDB. Be creative. Show off. Make it interesting.

# The Process

## Dependency Usage:

### serverless-s3-sync

This plugin is used to automatically upload files in the "data" local folder to the "goodreads" folder within the S3 bucket.
