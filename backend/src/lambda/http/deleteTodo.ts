// import 'source-map-support/register'
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { deleteTodoById } from '../../businessLogic/Todos'

// const utils = require("../utils.ts")

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const todoId = event.pathParameters.todoId
//   console.log("Deleting id  : " + todoId)
//   const userId = utils.getUserId(event);

//   const result = await deleteTodoById(userId,todoId);
//   console.log(JSON.stringify(result))
//   if (result.ConsumedCapacity == undefined) {
//     return {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*'
//       },
//       body: ""
//     }
//   }
//   // Item doesn't exist
//   return {
//     statusCode: 404,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       error: 'Todo does not exist '
//     })
//   }

// }
