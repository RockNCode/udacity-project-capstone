// import 'source-map-support/register'
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { getAllTodosById } from '../../businessLogic/todos'

// const utils = require("../utils.ts")

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // TODO: Get all TODO items for a current user
//   console.log('Caller event', event)
//   const userId = utils.getUserId(event);
//   const result = await getAllTodosById(userId);

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({items : result})
//   }

// }
