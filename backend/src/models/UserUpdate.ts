import { String } from "aws-sdk/clients/acm";

export interface UserUpdate {
  name: string
  fileUrl: String
  age: number
  targetSleep: number
  targetMilk: number
  targetPee: number
  targetPoop: number
}