const AWS = require('aws-sdk');
const { accessKey, secretAccessKey } = require('./env');
const s3 =  new AWS.S3({
    accessKeyId: "AKIA2EGSZT2MKSXDFU7K",
    secretAccessKey:"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",
    region: 'ap-south-1'
})

module.exports  = s3;