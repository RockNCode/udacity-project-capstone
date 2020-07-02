import { APIGatewayProxyEvent } from "aws-lambda";
//import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
import * as AWS  from 'aws-sdk'

export function getUserId(event: APIGatewayProxyEvent): string {
  event // delete this line
  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]

  // return parseUserId(jwtToken)

  // HACK return single user for now
  return "mgarcia"
}

export function createDynamoDbClient(){
  if(process.env.IS_OFFLINE) {
    console.log("Creating a local dynamo db instance")
    return new AWS.DynamoDB.DocumentClient({
      region : 'localhost',
      endpoint : 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient();
}