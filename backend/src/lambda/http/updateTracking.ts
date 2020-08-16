import 'source-map-support/register'
import { updateTrackingById } from '../../businessLogic/tracking'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
const utils = require("../utils.ts")
import { UpdateTrackingRequest } from '../../requests/UpdateTrackingRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const trackingId = event.pathParameters.trackingId
  const updateData: UpdateTrackingRequest = JSON.parse(event.body)
  const userId = utils.getUserId(event);

  console.log("Updating id  : " + trackingId)
  const result =  await updateTrackingById(updateData,userId,trackingId);
  console.log("Result is : " + JSON.stringify(result))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }
}
