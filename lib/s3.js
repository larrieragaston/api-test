const S3Client = require('aws-sdk/clients/s3')

class S3 {
  constructor(config, logger) {
    this.config = config.aws
    this.logger = logger.child({ context: 'S3' })
    this.logger.verbose('Creating S3 client instance')
    this.client = new S3Client({
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
    })
    this.logger.verbose('S3 client instance created')
  }

  async upload({ buffer, key, contentType, contentLength }) {
    this.logger.verbose(`Uploading buffer to S3 using key ${key}`)
    return this.client
      .putObject({
        Bucket: this.config.bucket,
        Key: key,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: contentType,
        ContentLength: contentLength,
      })
      .promise()
  }

  async remove(key) {
    this.logger.verbose(`Removing ${key} file from S3`)
    return this.client
      .deleteObject({
        Bucket: this.config.bucket,
        Key: key,
      })
      .promise()
  }

  async getFileSignedUrl({ key }) {
    const s3Params = {
      Bucket: this.config.bucket,
      Key: key,
      Expires: 60,
    }
    return this.client.getSignedUrl('getObject', s3Params)
  }
}

module.exports = S3
