// import 'source-map-support/register'
// import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import { generatePresignedUploadToS3 } from '../../businessLogic/Todos'

// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   const todoId = event.pathParameters.todoId;

//   const s3Url = await generatePresignedUploadToS3(todoId);

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({uploadUrl : s3Url})
//   }
// }