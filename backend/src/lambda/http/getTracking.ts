import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllTrackingItemsById } from '../../businessLogic/tracking'

const utils = require("../utils.ts")

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event :', event)
  const userId = utils.getUserId(event);
  const isoDate = event.pathParameters.isoDate;
  console.log("AT GET CALL isoDate : "  + isoDate)


  const result = await getAllTrackingItemsById(userId,isoDate);
  console.log("Getting profile from user: " + userId + " result to return " + JSON.stringify(result))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({items : result})
  }

}
