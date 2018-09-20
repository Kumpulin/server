const AWS = require('aws-sdk')
const fs = require('fs')
const fileType = require('file-type')

AWS.config.update({
  accessKeyId: process.env.AWS_SECRET_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

AWS.config.setPromisesDependency(Promise)

const s3 = new AWS.S3()

async function uploadImage(imagePath, folder) {
  try {
    const buffer = fs.readFileSync(imagePath)
    const type = fileType(buffer)
    const params = {
      ACL: 'public-read',
      Body: buffer,
      Bucket: 'kumpulin-images',
      ContentType: type.mime,
      Key: `${folder}/${Date.now().toString()}-lg.${type.ext}`
    }

    const data = await s3.upload(params).promise()

    return data
  } catch (err) {
    return err
  }
}

async function deleteImage(image) {
  try {
    const params = {
      Bucket: 'kumpulin-images',
      Key: image
    }

    const data = await s3.deleteObject(params).promise()

    return data
  } catch (err) {
    return err
  }
}

module.exports = {
  uploadImage,
  deleteImage
}
