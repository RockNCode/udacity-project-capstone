import { apiEndpoint } from '../config'
import { TrackingItem } from '../types/Tracking';
import { CreateTrackingRequest } from '../types/CreateTrackingRequest';
import Axios from 'axios'
import { UpdateTrackingRequest } from '../types/UpdateTrackingRequest';
import { ProfileItem } from '../types/ProfileItem';

export async function getTracking(idToken: string, isoDate: string): Promise<TrackingItem[]> {
  console.log('Fetching tracking items from api ' + `${apiEndpoint}/trackingdate/${isoDate}`)

  const response = await Axios.get(`${apiEndpoint}/trackingdate/`+isoDate, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Trackings:', response.data)
  return response.data.items
}

export async function getProfileInfo(idToken: string): Promise<ProfileItem[]> {
  console.log('Fetching profile items')

  const response = await Axios.get(`${apiEndpoint}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('profile:', response.data)
  return response.data.items
}

export async function createTracking(
  idToken: string,
  newTracking: CreateTrackingRequest
): Promise<TrackingItem> {
  console.log("Tracking obj : " + JSON.stringify(newTracking))
  const response = await Axios.post(`${apiEndpoint}/tracking`,  JSON.stringify(newTracking), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchTracking(
  idToken: string,
  trackingId: string,
  updatedTracking: UpdateTrackingRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/tracking/${trackingId}`, JSON.stringify(updatedTracking), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function patchProfile(
  idToken: string,
  profileItem : ProfileItem
): Promise<void> {
  console.log("at patch profile : "  + JSON.stringify(profileItem) +  " id token : "+ idToken)
  await Axios.patch(`${apiEndpoint}/profile`, JSON.stringify(profileItem), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTracking(
  idToken: string,
  trackingId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/tracking/${trackingId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  trackingId: string
): Promise<string> {
  console.log("Calling api  new" + `${apiEndpoint}/profile/attachment`)
  const response = await Axios.post(`${apiEndpoint}/profile/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })

  console.log("Upload URL IS " + response.data.uploadUrl)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
