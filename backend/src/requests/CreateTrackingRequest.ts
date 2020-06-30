/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateTodoRequest {
  date: string
  type: string,
  timeStart: number
}
