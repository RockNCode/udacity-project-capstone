# Baby tracker project

Application meant to plan and track feeding schedule, medications, sleep tracker and diaper change for a baby.

# Functionality of the application

The application is based on serverless rubric.

# Background

Specially useful for babies with feeding problems or swallow issues, as they have to follow a more strict nutrition schedule.

# TODO items

The application will store the planned schedule and by date table, will compare planned vs actual and give totals per day:

The planned schedule table will have the following fields

The profile table (unique)
* `minSleepPerDay`(string) Planned sleep per day
* `minFeedPerDay`(string) Planned total milk per day (ml)
* `breastfeed`(string) Planned total breast milk per day (ml)
* `formula` (string) Planned total formule milk per day (ml)

The days table
* `date` (string) - the unique id for an item
* `napStart` (string)(optional) -  time when baby started started
* `napEnd` (string)(optional) - time of when baby woke up
* `breastfeed` (string)(optional) -  time of when baby was breast fed
* `formula` (string)(optional) - time when baby fed using formula
* `peeDiaper` (string) (optional) - time when baby had a pee diaper change
* `poopDiaper` (string) (optional) - time when baby had a pee diaper change
* `comments` (string) (optional) - any comments


