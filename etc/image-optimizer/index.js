'use strict';

const querystring = require('querystring'); // Don't install.
const AWS = require('aws-sdk'); // Don't install.

// http://sharp.pixelplumbing.com/en/stable/api-resize/
const Sharp = require('sharp');

const S3 = new AWS.S3({
  region: 'ap-northeast-2', // 버킷을 생성한 리전 입력(여기선 서울)
});

const BUCKET = 'xircle-profile-upload'; // Input your bucket

// Image types that can be handled by Sharp
const supportImageTypes = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'webp',
  'svg',
  'tiff',
  'jfif',
];

exports.handler = async (event, context, callback) => {
  const { request, response } = event.Records[0].cf;

  // Parameters are w, h, f, q and indicate width, height, format and quality.
  const { uri } = request;

  const ObjectKey = decodeURIComponent(uri).substring(1);
  const params = querystring.parse(request.querystring);
  const { w, h, q, f } = params;

  /**
   * ex) https://dilgv5hokpawv.cloudfront.net/dev/thumbnail.png?w=200&h=150&f=webp&q=90
   * - ObjectKey: 'dev/thumbnail.png'
   * - w: '200'
   * - h: '150'
   * - f: 'webp'
   * - q: '90'
   */

  // 크기 조절이 없는 경우 원본 반환.
  if (!(w || h)) {
    return callback(null, response);
  }

  const extension = uri.match(/\/?(.*)\.(.*)/)[2].toLowerCase();

  const width = parseInt(w, 10) || null;
  const height = parseInt(h, 10) || null;
  const quality = parseInt(q, 10) || 100; // Sharp는 이미지 포맷에 따라서 품질(quality)의 기본값이 다릅니다.
  let format = (f || extension).toLowerCase();
  let s3Object;
  let resizedImage;

  // 포맷 변환이 없는 GIF 포맷 요청은 원본 반환.
  if (extension === 'gif' && !f) {
    return callback(null, response);
  }

  // Init format.
  format = format === 'jpg' ? 'jpeg' : format;

  if (!supportImageTypes.some((type) => type === extension)) {
    responseHandler(403, 'Forbidden', 'Unsupported image type', [
      {
        key: 'Content-Type',
        value: 'text/plain',
      },
    ]);
    return callback(null, response);
  }

  // Verify For AWS CloudWatch.
  // console.log(`parmas: ${JSON.stringify(params)}`); // Cannot convert object to primitive value.\
  // console.log('S3 Object key:', ObjectKey);
  // console.log('Bucket name : ', BUCKET);

  try {
    s3Object = await S3.getObject({
      Bucket: BUCKET,
      Key: ObjectKey,
    }).promise();
  } catch (error) {
    responseHandler(404, 'Not Found', 'OMG... The image does not exist.', [
      { key: 'Content-Type', value: 'text/plain' },
    ]);
    return callback(null, response);
  }

  try {
    resizedImage = await Sharp(s3Object.Body)
      .rotate()
      .resize(width, height)
      .toFormat(format, {
        quality,
      })
      .toBuffer();
  } catch (error) {
    // console.log('Sharp error : ', error);
    responseHandler(500, 'Internal Server Error', 'Fail to resize image.', [
      {
        key: 'Content-Type',
        value: 'text/plain',
      },
    ]);
    return callback(null, response);
  }

  // 응답 이미지 용량이 1MB 이상일 경우 원본 반환.
  if (Buffer.byteLength(resizedImage, 'base64') >= 1048576) {
    return callback(null, response);
  }

  responseHandler(
    200,
    'OK',
    resizedImage.toString('base64'),
    [
      {
        key: 'Content-Type',
        value: `image/${format}`,
      },
    ],
    'base64',
  );

  /**
   * @summary response 객체 수정을 위한 wrapping 함수
   */
  function responseHandler(
    status,
    statusDescription,
    body,
    contentHeader,
    bodyEncoding,
  ) {
    response.status = status;
    response.statusDescription = statusDescription;
    response.body = body;
    response.headers['content-type'] = contentHeader;
    if (bodyEncoding) {
      response.bodyEncoding = bodyEncoding;
    }
  }

  console.log('Success resizing image');

  return callback(null, response);
};
