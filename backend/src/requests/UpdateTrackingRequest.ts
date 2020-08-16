/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateTrackingRequest {
  amount: number
  duration: number
  comments: string
}