// import * as uuid from 'uuid'

// import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

// import { TodosAccess } from '../dataLayer/todosAccess'
// import { CreateTodoRequest } from '../requests/CreateTrackingRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTrackingRequest'

// const todosAccess = new TodosAccess()
// const bucket = process.env.IMAGES_S3_BUCKET

// export async function getAllTodosById(userId): Promise<TodoItem[]> {
//     return await todosAccess.getTodosByUserId(userId)
// }

// export async function createTodo(
//     createTodoRequest: CreateTodoRequest,
//     userId: string
//   ): Promise<TodoItem> {

//     const todoId = uuid.v4()
//     const item : TodoItem = {
//         todoId,
//         userId,
//         createdAt: new Date().toISOString(),
//         ...createTodoRequest,
//         done: false,
//         attachmentUrl: 'http://'+bucket+'.s3.amazonaws.com/'+todoId
//       }

//     return await todosAccess.createTodo(item)
//   }

//   export async function deleteTodoById(userId : string, todoId : string){
//       return await todosAccess.deleteTodoById(userId, todoId);
//   }

//   export async function updateTodoById(updateTodoRequest : UpdateTodoRequest,
//     userId: string, todoId : string) {
//         const item : TodoUpdate = {
//             ...updateTodoRequest,
//         }
//     return await todosAccess.updateTodoById(item,userId,todoId);

//   }

//   export async function generatePresignedUploadToS3(todoId: string)  {
//       return await todosAccess.generatePresignedUrl(todoId);
//   }
