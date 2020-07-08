'use strict'

const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})
const s3 = new aws.S3()
const table = process.env.TABLE_NAME
const bucket = process.env.BUCKET_NAME

// getBooks takes review data which has been stored in S3 and grabs some of the data from books I've reviewed
const getBooks = async () => {
  const params = {
    Bucket: bucket,
    Key: 'reviews.json'
  }

  const reviewsRes = await s3.getObject(params).promise()
  const reviews = JSON.parse(reviewsRes.Body.toString()).reviews

  return reviews.map((el) => {
    return {
      id: el.book.id,
      title: el.book.title,
      description: el.book.description,
      averageRating: el.book.average_rating,
      published: el.book.published,
      publisher: el.book.publisher,
      numPages: el.book.num_pages,
      isbn: el.book.isbn,
      isbn13: el.book.isbn13,
      link: el.book.link,
      imageURL: el.book.image_url
    }
  })
}

// getBatches takes array of raw data to be sent to DynamoDB and returns matrix of putRequests
const getBatches = (arr) => {
  let chunked = []
  // chunks array into sets of 25 (DynamoDB batchWrite write limit)
  if (arr.length > 25) {
    for (let i = 0; i < arr.length; i += 25) {
      chunked.push(arr.slice(i, i + 25))
    }
  } else {
    //expects array of chunk arrays
    chunked = [[...arr]]
  }

  const batches = chunked.map((chunk) => {
    return chunk.map(formatBookPutRequest)
  })

  return batches
}

// formatBookPutRequest takes book object and wraps it in a PutRequest
const formatBookPutRequest = (book) => {
  return {
    PutRequest: {
      Item: {
        ...book
      }
    }
  }
}

// writeBookBatches saves batches into database
const writeBookBatches = async (batches) => {
  const promises = batches.map((batch) => {
    const params = {
      RequestItems: {
        [table]: [...batch]
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
  }

  return {
    statusCode: 200,
    body:
      'Lambda Successful, DynamoDB table has been populated with books content.'
  }
}
