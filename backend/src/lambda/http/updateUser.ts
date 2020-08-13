import 'source-map-support/register'
import { updateUserByName } from '../../businessLogic/tracking'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
const utils = require("../utils.ts")
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const trackingId = event.pathParameters.todoId
  const updateData: UpdateUserRequest = JSON.parse(event.body)
  const userId = utils.getUserId(event);

  //console.log("Updating id  : " + trackingId)
  const result =  await updateUserByName(updateData,userId);
  console.log("Result is : " + JSON.stringify(result))
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(result)
  }
}
