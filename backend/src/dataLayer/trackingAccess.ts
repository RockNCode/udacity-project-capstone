import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import * as AWSXRay from 'aws-xray-sdk'
import { TrackingItem } from '../models/TrackingItem'
import { TrackingUpdate } from '../models/TrackingUpdate'
import { UserUpdate } from '../models/UserUpdate'

import * as AWS  from 'aws-sdk'

//const XAWS = AWSXRay.captureAWS(AWS)

export class TrackingAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly trackingTable = process.env.TRACKER_TABLE,
    private readonly usersTable = process.env.USERS_TABLE) {
  }

  async getTrackingByUserId(userId : string, isoDate : string ): Promise<TrackingItem[]> {
    console.log('Getting all Tracking items for user with IsoDate' + isoDate)
    let d = new Date(parseInt(isoDate));
    console.log("Date at DB read is : "+ d)
    let curr_month = d.getMonth() ;
    let curr_day = d.getDate();
    let curr_year = d.getFullYear();
    // let curr_hour = d.getHours();
    // let curr_min = d.getMinutes();
    let dateStart= new Date(curr_year,curr_month,curr_day,0,0,0,0); // time start 0:00 UTC
    let dateEnd= new Date(curr_year,curr_month,curr_day,23,59,59,99); // time start 0:00 UTC

    let isoStart = dateStart.toISOString();
    let isoEnd = dateEnd.toISOString();
    console.log("Checking times between : " + dateStart + " and " + dateEnd);
    const result = await this.docClient.query({
        TableName : this.trackingTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
            // ':dateStart':isoStart,
            // ':dateEnd':isoEnd
        }
    }).promise()

    const items = result.Items
    const itemsFiltered = items.filter(item => (item.date >= isoStart && item.date < isoEnd) );
    console.log("Filtered items : " + JSON.stringify(itemsFiltered))
    return itemsFiltered as TrackingItem[]
  }

  async getProfileByUserId(userId : string ): Promise<UserUpdate[]> {
    console.log('Getting all Tracking items for user : ' + userId)

    const result = await this.docClient.query({
        TableName : this.usersTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    const items = result.Items
    console.log("At data layer items is : " + JSON.stringify(items))
    return items as UserUpdate[]
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
                       console.log("At updating tracking by id, item is " + JSON.stringify(item))
        var params = {
            TableName:this.trackingTable,
            Key:{
                "userId": userId,
                "trackingId": trackingId
            },
            ExpressionAttributeNames: { "#myduration": "duration" },
            UpdateExpression: "set amount = :amount, #myduration=:taskduration, comments=:comments",
            ExpressionAttributeValues:{
                ":amount":item.amount,
                ":taskduration":item.duration,
                ":comments": item.comments
            },
            ReturnValues:"UPDATED_NEW"
          };
        console.log("Params are : " + JSON.stringify(params))
        await this.docClient.update(params).promise()
        return item
    }

    async updateUser(item : UserUpdate,
      userId : string,
      // name : string,
      ): Promise<UserUpdate> {
      var params = {
        TableName:this.usersTable,
        Key:{
          "userId": userId
          // "name": item.name
        },
        //ExpressionAttributeNames: { "#myname": "name" },
        UpdateExpression: "set fullname = :name, age=:age, targetsleep=:targetsleep, targetmilk=:targetmilk, targetpee=:targetpee, targetpoop=:targetpoop, fileUrl = :fileUrl",
        ExpressionAttributeValues:{
          ":name":item.name,
          ":age": item.age,
          ":targetsleep": item.targetSleep,
          ":targetmilk": item.targetMilk,
          ":targetpee": item.targetPee,
          ":targetpoop": item.targetPoop,
          ":fileUrl":item.fileUrl

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
