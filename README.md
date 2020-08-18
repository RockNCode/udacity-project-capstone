# Baby tracker project

Application meant to plan and track feeding schedule, medications, sleep tracker and diaper change for a baby.

# Functionality of the application

The application is based on serverless rubric.

# Background

This application is based ont he baby tracking notebooks that are commonly sold to keep a baby on schedule. Specially useful for babies with feeding problems or swallow issues, as they have to follow a more strict nutrition schedule.

# Disclaimer.
I didn't have time (nor previous skills) to polish the frontend but the application is functional. I had to learn some react on the fly to finish it.

# Setup 

## Backend

After cloning the project

cd backend

npm i 

serverless plugin install --name serverless-webpack

serverless plugin install --name serverless-iam-roles-per-function

serverless plugin install --name serverless-reqvalidator-plugin

serverless plugin install --name serverless-aws-documentation

serverless plugin install --name  serverless-dynamodb-local

serverless plugin install --name serverless-offline

serverless plugin install --name serverless-s3-local

serverless deploy -v

## Client

cd ../client/

npm i

### config.ts
Set the apiId to the right value (obtained in the serverless log) and run:

npm run start

# Tracker items.

The application will store the planned schedule and by date table, will compare planned vs actual and give totals per day:

The planned schedule table will have the following fields

The profile table (unique)
* `userId` (string) - the userId
* `targetSleep`(string) Target sleep per day
* `targetMilk`(string) Target total milk (Breastfeed + Formula) per day (ml) 
* `targetPee`(string) Target pee diaper changes per day.
* `targetPoop`(string) Target poop diaper changes per day.
* `name`(string) Baby's name.
* `age`(string) Baby's age.
* `fileUrl`(string) Image file url.

The tracker table
* `userId` (string) - the userId (hash key)
* `trackingId` (string) - the tracking id (range key)
* `date` (string) - the unique id for an item
* `type` (string) - The type of tracking item (nap,formula, breastmilk, diaper)
* `duration` - how long a nap time lasted (only available on nap times).
* `amount` - Amount in ML of formula or breastmilk,
* `comments` (string) (optional) - any comments

# Application usage

The first screen that will be shown after loging in is the following one : 

![First screen](/images/FirstScreen.png)

At this point we can start creating Sleep, Feed, Medication and Nap type items to start tracking the baby. But it is better to first add a profile information so that the user can track if the goals for the day have been met.

# Profile Screen

![Profile Screen](/images/ProfilePage.png)

At the profile screen (different DB table), the user can set its goals for his/her baby, like pee or poop diaper changes, feedings,etc, so in case for example the baby didn't had a poop diaper change for the day the user can notice and go back to check how many days the baby hasn't pooped and maybe tell this information to a pediatrician. 

Note: There is a frontend issue, when the user uploads an image for the first time, the image won't refresh immediately so you'd need to navigate away and come back to see it, but if user updates the image the refresh does happen. I didn't have enough time to debug this before the next billing cycle but the functions required for the course are working.



# Back to the main screen.

## Item creation

### Date time picker

As mentioned before, the date time picker acts both as a date/time chooser for the item being created as well as a filter for the table. This is so that the user has the flexibility to add items on passed dates in case some information was missing. And also if you switch the day, you'll see the information displayed on the table changes to the one for that day.
![Date Time](/images/DateTime.png)


### Item creation form

The item creation form is pretty straight forward, user selects the type of event that was done for the baby and this gets recorded on the DB.
![Create Item](/images/CreateItem.png)

### The table.
The table displays the information of all the types of tracking items for the child. At the table itself you can modify value for amounts, duration and comments, once a value in the text field changes you will see the check mark in case you want to commit the changes to the DB.
![Edit visible](/images/EditVisible.png)

Once you start filling the table, you can see that if you go above the thresholds that were set as goals for the child, messages will start appearing in the Goals information box, letting the user know that the goals for the day have been met:
![One goal](/images/OneGoalMet.png)

And this is an example of when all the goals have been met :

![All goals](/images/AllGoalsMet.png)

This is all the functionality that this app has, we have one tracker notebook at home to check how much our baby has been fed so that's where the idea to make something like this was born.

