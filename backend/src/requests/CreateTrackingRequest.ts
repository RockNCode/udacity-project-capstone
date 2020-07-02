/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTrackingRequest {
  date: string
  type: string,
  timeStart: string
  duration: number
  comments: string
}
