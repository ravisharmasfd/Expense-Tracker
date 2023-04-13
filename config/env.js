require('dotenv').config()
module.exports.PORT = process.env.PORT || 3000;
module.exports.jwtSecret = process.env.JWT_SECRET
module.exports.dbName = process.env.DATABASE_NAME;
module.exports.dbUser = process.env.DATABASE_USER;
module.exports.dbPass = process.env.DATABASE_PASS;
module.exports.dbHost = process.env.DATABASE_HOST;
module.exports.payKeyId = process.env.PAY_KEY_ID;
module.exports.payKeySecret = process.env.PAY_KEY_SECRET;
module.exports.emailKey = process.env.EMAIL_KEY;
module.exports.accessKey = process.env.ACCESS_KEY;
module.exports.secretAccessKey = process.env.SECRET_ACCESS_KEY;
module.exports.s3Bucket = process.env.S3_BUCKET;

