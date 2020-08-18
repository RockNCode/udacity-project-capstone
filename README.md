# Baby tracker project

Application meant to plan and track feeding schedule, medications, sleep tracker and diaper change for a baby.

# Functionality of the application

The application is based on serverless rubric.

# Background

This application is based ont he baby tracking notebooks that are commonly sold to keep a baby on schedule. Specially useful for babies with feeding problems or swallow issues, as they have to follow a more strict nutrition schedule.

# Disclaimer.
I didn't have time (nor previous skills) to polish the frontend but the application is functional. I had to learn some react on the fly to finish it.

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

# Setup

The first screen that will be shown after loging in is the following one : 

![First screen](/images/FirstScreen.png)

At this point we can start creating Sleep, Feed, Medication and Nap type items to start tracking the baby. But it is better to first add a profile information so that the user can track if the goals for the day have been met.

# Profile Screen

At the profile screen (different DB table), the user can set its goals for his/her baby, like pee or poop diaper changes, feedings,etc, so that in case for example the baby didn't had a poop change for the day the user can notice and go back to check how many days the baby hasn't pooped and maybe tell this information to a pediatrician. 

Note: There is a frontend issue, when the user uploads an image for the first time, the image won't refresh immediately so you'd need to navigate away and come back to see it, but if user updates the image the refresh does happen. I didn't have enough time to debug this before the next billing cycle but the functions requiered for the course are working.


# Back to the main screen.

## Date/time picker

The date picker acts both as a date filter for the table and as time chooser for the new item creation. You can add items on different dates and times by changing the values on the date filter and it will also display different information on the table as you change it.  

## The table


