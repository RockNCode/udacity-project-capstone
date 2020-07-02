import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTrackingRequest } from '../../requests/CreateTrackingRequest'
import { TrackingItem } from '../../models/TrackingItem';
import { createTracking } from '../../businessLogic/Tracking'

const utils = require("../utils.ts");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTracking: CreateTrackingRequest = JSON.parse(event.body)
  console.log(newTracking)
  const newItem = await createTrackingApp(event);
  console.log(JSON.stringify(event))
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item : newItem,
    })
  }
}

async function createTrackingApp(event: any) {
  const newTodo: TrackingItem = JSON.parse(event.body)
  const userId = utils.getUserId(event);
  console.log(event)
  return await createTracking(newTodo,userId);
}
