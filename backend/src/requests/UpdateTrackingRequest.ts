/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTrackingRequest {
  timeStart: string
  duration: number
  comments: string
}