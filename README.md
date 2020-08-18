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


