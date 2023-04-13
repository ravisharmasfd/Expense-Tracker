const AWS = require('aws-sdk');
const { accessKey, secretAccessKey } = require('./env');
const s3 =  new AWS.S3({
    accessKeyId: accessKey,
    secretAccessKey:secretAccessKey,
    region: 'ap-south-1'
})

module.exports  = s3;