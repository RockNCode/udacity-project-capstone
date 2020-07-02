import * as uuid from 'uuid'
import { TrackingItem } from '../models/TrackingItem'
import { TrackingUpdate } from '../models/TrackingUpdate'

import { TrackingAccess } from '../dataLayer/trackingAccess'
import { CreateTrackingRequest } from '../requests/CreateTrackingRequest'
// import { CreateTodoRequest } from '../requests/CreateTrackingRequest'
import { UpdateTrackingRequest } from '../requests/UpdateTrackingRequest'

const trackingAccess = new TrackingAccess()
// const bucket = process.env.IMAGES_S3_BUCKET

export async function getAllTrackingItemsById(userId): Promise<TrackingItem[]> {
    return await trackingAccess.getTrackingByUserId(userId)
}

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

  export async function deleteTrackingById(userId : string, trackingId : string){
      return await trackingAccess.deleteTrackingById(userId, trackingId);
  }

  export async function updateTrackingById(updateTodoRequest : UpdateTrackingRequest,
    userId: string, trackingId : string) {
        const item : TrackingUpdate = {
            ...updateTodoRequest,
        }
    return await trackingAccess.updateTrackingById(item,userId,trackingId);

  }

//   export async function generatePresignedUploadToS3(todoId: string)  {
//       return await todosAccess.generatePresignedUrl(todoId);
//   }
