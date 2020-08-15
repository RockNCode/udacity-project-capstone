import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generatePresignedUploadToS3 } from '../../businessLogic/tracking'
const utils = require("../utils.ts")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const trackingId = event.pathParameters.trackingId;
  const userId = utils.getUserId(event);
  const s3Url = await generatePresignedUploadToS3(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({uploadUrl : s3Url})
  }
}