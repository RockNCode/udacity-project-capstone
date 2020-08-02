import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import * as AWSXRay from 'aws-xray-sdk'
import { TrackingItem } from '../models/TrackingItem'
import { TrackingUpdate } from '../models/TrackingUpdate'
import * as AWS  from 'aws-sdk'

//const XAWS = AWSXRay.captureAWS(AWS)

export class TrackingAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly trackingTable = process.env.TRACKER_TABLE) {
  }

  async getTrackingByUserId(userId : string ): Promise<TrackingItem[]> {
    console.log('Getting all Tracking items for user')

    const result = await this.docClient.query({
        TableName : this.trackingTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    const items = result.Items
    return items as TrackingItem[]
  }

  async createTrackingDB(item: TrackingItem): Promise<TrackingItem> {
    await this.docClient
        .put({
        TableName: this.trackingTable,
        Item: item
        })
        .promise()
    return item
    }

    async deleteTrackingById(userId : string, trackingId : string): Promise<any> {
        console.log("Before delete UserId : " + userId + " Tracking id : " + trackingId)
        var params = {
            TableName:this.trackingTable,
              Key : {
                  "userId": userId,
                  "trackingId": trackingId
              }
            };

        return await this.docClient.delete(params).promise()
    }

    async updateTrackingById(item : TrackingUpdate,
                        userId : string,
                        trackingId : string,
                     ): Promise<TrackingUpdate> {
        var params = {
            TableName:this.trackingTable,
            Key:{
                "userId": userId,
                "trackingId": trackingId
            },
            //ExpressionAttributeNames: { "#myname": "name" },
            UpdateExpression: "set timeStart = :timeStart, duration=:duration, comments=:comments",
            ExpressionAttributeValues:{
                ":timeStart":item.timeStart,
                ":duration":item.duration,
                ":comment": item.comments
            },
            ReturnValues:"UPDATED_NEW"
          };
        await this.docClient.update(params).promise()
        return item
    }

    async generatePresignedUrl(todoId : string) {
        const s3 = new AWS.S3({signatureVersion: 'v4'})
        const signedUrlExpireSeconds = 60 * 5;

        return await s3.getSignedUrl('putObject', {
          Bucket: process.env.IMAGES_S3_BUCKET,
          Key: todoId,
          Expires: signedUrlExpireSeconds,
        });

    }


}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
