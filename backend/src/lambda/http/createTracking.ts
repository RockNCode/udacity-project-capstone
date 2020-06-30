import 'source-map-support/register'
//import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

// import { CreateTodoRequest } from '../../requests/CreateTrackingRequest'
// import { TodoItem } from '../../models/TodoItem';
// import { createTodo } from '../../businessLogic/Todos'

// const utils = require("../utils.ts");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const newTodo: CreateTodoRequest = JSON.parse(event.body)
  // console.log(newTodo)
  // const newItem = await createTodoApp(event);
  console.log(JSON.stringify(event))
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item : "test",
    })
  }
}

// async function createTodoApp(event: any) {
//   const newTodo: TodoItem = JSON.parse(event.body)
//   const userId = utils.getUserId(event);
//   console.log(event)
//   return await createTodo(newTodo,userId);
// }
