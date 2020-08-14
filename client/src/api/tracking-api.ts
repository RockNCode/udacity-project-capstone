import { apiEndpoint } from '../config'
import { TrackingItem } from '../types/Tracking';
import { CreateTrackingRequest } from '../types/CreateTrackingRequest';
import Axios from 'axios'
import { UpdateTrackingRequest } from '../types/UpdateTrackingRequest';
import { ProfileItem } from '../types/ProfileItem';

export async function getTracking(idToken: string): Promise<TrackingItem[]> {
  console.log('Fetching tracking items')

  const response = await Axios.get(`${apiEndpoint}/tracking`, {
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
  const response = await Axios.post(`${apiEndpoint}/tracking/${trackingId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
