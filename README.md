# Baby tracker project

Application meant to plan and track feeding schedule, medications, sleep tracker and diaper change for a baby.

# Functionality of the application

The application is based on serverless rubric.

# Background

Specially useful for babies with feeding problems or swallow issues, as they have to follow a more strict nutrition schedule.

# Tracker items.

The application will store the planned schedule and by date table, will compare planned vs actual and give totals per day:

The planned schedule table will have the following fields

The profile table (unique)
* `userId` (string) - the userId
* `minSleepPerDay`(string) Planned sleep per day
* `minFeedPerDay`(string) Planned total milk per day (ml)
* `breastfeed`(string) Planned total breast milk per day (ml)
* `formula` (string) Planned total formule milk per day (ml)

The tracker table
* `userId` (string) - the userId
* `date` (string) - the unique id for an item
* `type` (string) - The type of tracking item (nap,formula, breastmilk, diaper)
* `timeStart` - the time at which the event happend.
* `duration` - how long it lasted (only valuable for nap times).
* `comments` (string) (optional) - any comments


