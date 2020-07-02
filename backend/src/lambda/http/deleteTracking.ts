import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTrackingById } from '../../businessLogic/Tracking'

const utils = require("../utils.ts")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const trackingId = event.pathParameters.trackingId
  console.log("Deleting id  : " + trackingId)
  const userId = utils.getUserId(event);

  const result = await deleteTrackingById(userId,trackingId);
  console.log(JSON.stringify(result))
  if (result.ConsumedCapacity == undefined) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ""
    }
  }
  // Item doesn't exist
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: 'Tracking does not exist '
    })
  }

}
