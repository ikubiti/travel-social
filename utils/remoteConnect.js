const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME || '';
const region = process.env.AWS_BUCKET_REGION || '';
const accessKeyId = process.env.AWS_ACCESS_KEY || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const awsUrl = process.env.AWS_CDN_URL || '';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const uploadFile = async (fileBuffer, fileName, mimetype) => {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  // Return the public URL.
  return `${awsUrl}/${fileName}`;
};

const deleteFile = (fileName) => {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };

  return s3Client.send(new DeleteObjectCommand(deleteParams));
};

module.exports = {
  uploadFile,
  deleteFile,
};
