// import 'source-map-support/register'
// import { updateTodoById } from '../../businessLogic/todos'
// import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// const utils = require("../utils.ts")
// import { UpdateTodoRequest } from '../../requests/UpdateTrackingRequest'

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const todoId = event.pathParameters.todoId
//   const updateData: UpdateTodoRequest = JSON.parse(event.body)
//   const userId = utils.getUserId(event);

//   console.log("Updating id  : " + todoId)
//   const result =  await updateTodoById(updateData,userId,todoId);
//   console.log("Result is : " + JSON.stringify(result))
//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: ""
//   }
// }
