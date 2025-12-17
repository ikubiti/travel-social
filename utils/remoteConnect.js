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
const saveLocation = process.env.AWS_PARENT_FOLDER || '';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const uploadFile = async (fileBuffer, fileName, mimetype) => {
  const fullFileName = saveLocation + fileName;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fullFileName,
    ContentType: mimetype,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));
  return `${awsUrl}/${fullFileName}`;
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
