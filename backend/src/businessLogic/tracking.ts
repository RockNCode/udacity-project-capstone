import * as uuid from 'uuid'
import { TrackingItem } from '../models/TrackingItem'
import { UserUpdate } from '../models/UserUpdate'
import { TrackingUpdate } from '../models/TrackingUpdate'

import { TrackingAccess } from '../dataLayer/trackingAccess'
import { CreateTrackingRequest } from '../requests/CreateTrackingRequest'
// import { CreateTodoRequest } from '../requests/CreateTrackingRequest'
import { UpdateTrackingRequest } from '../requests/UpdateTrackingRequest'
import { UpdateUserRequest } from '../requests/UpdateUserRequest'

const trackingAccess = new TrackingAccess()
// const bucket = process.env.IMAGES_S3_BUCKET

export async function getAllTrackingItemsById(userId,isoDate): Promise<TrackingItem[]> {
    return await trackingAccess.getTrackingByUserId(userId,isoDate)
}

export async function getProfileItemsById(userId): Promise<UserUpdate[]> {
    return await trackingAccess.getProfileByUserId(userId)
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
        duration: createTrackingRequest.duration,
        amount: createTrackingRequest.amount,
        comments: createTrackingRequest.comments
    }

    return await trackingAccess.createTrackingDB(item)
  }

  export async function deleteTrackingById(userId : string, trackingId : string){
      return await trackingAccess.deleteTrackingById(userId, trackingId);
  }

  export async function updateTrackingById(updateTrackingRequest : UpdateTrackingRequest,
    userId: string, trackingId : string) {
        const item : TrackingUpdate = {
            ...updateTrackingRequest,
        }
    return await trackingAccess.updateTrackingById(item,userId,trackingId);

  }

  export async function updateUserByName(updateUserRequest : UpdateUserRequest,
    userId: string) {
        const item : UserUpdate = {
            ...updateUserRequest,
        }
    return await trackingAccess.updateUser(item,userId);
  }

  export async function generatePresignedUploadToS3(todoId: string)  {
      return await trackingAccess.generatePresignedUrl(todoId);
  }
