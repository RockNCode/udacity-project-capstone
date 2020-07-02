import * as uuid from 'uuid'
import { TrackingItem } from '../models/TrackingItem'
// import { TodoUpdate } from '../models/TodoUpdate'

import { TrackingAccess } from '../dataLayer/trackingAccess'
import { CreateTrackingRequest } from '../requests/CreateTrackingRequest'
// import { CreateTodoRequest } from '../requests/CreateTrackingRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTrackingRequest'

const trackingAccess = new TrackingAccess()
// const bucket = process.env.IMAGES_S3_BUCKET

// export async function getAllTodosById(userId): Promise<TodoItem[]> {
//     return await todosAccess.getTodosByUserId(userId)
// }

export async function createTracking(
    createTrackingRequest: CreateTrackingRequest,
    userId: string
  ): Promise<TrackingItem> {

    const trackingId = uuid.v4()
    const item : TrackingItem = {
        trackingId,
        userId,    
        date : createTrackingRequest.date,
        type: createTrackingRequest.type,
        timeStart: createTrackingRequest.timeStart,
        duration: createTrackingRequest.duration,
        comments: createTrackingRequest.comments
    }

    return await trackingAccess.createTrackingDB(item)
  }

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
