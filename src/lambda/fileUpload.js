const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { fileName, fileContent } = JSON.parse(event.body);

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(fileContent, 'base64'),
        ACL: 'private'
    };

    try {
        await s3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'File upload failed', error: error.message })
        };
    }
};
