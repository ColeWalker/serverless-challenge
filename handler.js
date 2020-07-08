'use strict'

const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})
const s3 = new aws.S3()

// Gets review data stored in S3, and grabs only the books I've reviewed
const getBooks = async () => {
  const params = {
    Bucket: 'voice-foundry-bucket',
    Key: 'books.json'
  }
  const reviewsRes = await s3.getObject(params).promise()
  const reviews = JSON.parse(reviewsRes.Body.toString())

  return reviews.reviews.map((el) => {
    return el.book
  })
}

const getBatches = (arr) => {
  let chunked = []
  if (arr.length > 25) {
    for (i = 0, j = arr.length; i < j; i += 25) {
      chunked.push(arr.slice(i, i + 25))
    }
  } else {
    chunked = [[...arr]]
  }

  const batches = chunked.map((chunk) => {
    return chunk.map(formatBookPutRequest)
  }, [])

  return batches
}

const formatBookPutRequest = (book) => {
  return {
    PutRequest: {
      Item: {
        ...book
      }
    }
  }
}

const writeBookBatches = async (batches) => {
  const promises = batches.map((batch) => {
    const params = {
      RequestItems: {
        books: [...batch]
      }
    }
    return dynamoDB.batchWrite(params).promise()
  })

  return Promise.all(promises)
}

module.exports.savebooks = async (event) => {
  const books = await getBooks()
  const batches = getBatches(books)

  try {
    await writeBookBatches(batches)
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          error: 'ERROR: ' + err
        },
        null,
        2
      )
    }
    throw new Error(err)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        ...batches
      },
      null,
      2
    )
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
