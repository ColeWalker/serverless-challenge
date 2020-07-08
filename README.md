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

# Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
- [Serverless](https://www.serverless.com/framework/docs/getting-started/)

This project assumes that you have the AWS CLI installed on your system which is configured to have a user logged in. It also assumes that you have the Serverless CLI installed.

# Usage

1. Run `npm install` in the directory to install dependencies
2. Run `npm start` to create cloud components and immediately invoke lambda

# What it does

The data folder stores a JSON document representing all of the book reviews on my Goodreads account. Serverless first uploads this file to an S3 bucket using the serverless-s3-sync plugin at the same time as it establishes the DynamoDB table and lambda function. The lambda function parses only certain information about the reviewed books. Then, it formats those books into batches to be sent to DynamoDB. DynamoDB only allows batch writes of up to 25 items, so each batch consists of 25 or less items. Then, the data is saved to the DynamoDB table established by Serverless, and a response is returned stating that everything went well.

# Style Guide

If you'd like to modify or add code, you can use the Prettier VSCode extension to keep your additions automatically formatted with the rules in place.

If you would prefer to use these rules in a different linter, the general rules are as follows:

- 2 spaces per indentation level
- Indent with spaces over tabs
- Single quotes for strings
- No semi-colons
- No trailing commas in objects or arrays

# Dependencies

| Dependency         | Use                                                                     |
| ------------------ | ----------------------------------------------------------------------- |
| serverless-s3-sync | Automatically upload files in the "data" local folder to the S3 bucket. |
| aws-sdk            | Allows interaction with Amazon Web Services                             |
