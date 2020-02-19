## Wanplan REST API Ver 1.0.0 Overview
Available tables are attraction, city, country, trip_detail, trip_overview, user. The structures are the same as those on json-server. Available filters are
1. attraction: city, style
1. city: prefecture, region, country
1. trip_overview: user, city, style
1. user: username, email

The follow table is for all table except trip_detail.
HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
GET | /api/tableName | Lists rows of table
POST | /api/tableName | Create a new row
GET | /api/tableName/:id | Retrieves a row by primary key (except country)
PUT | /api/tableName/:id | Updates row element by primary key (except city, country)
DELETE | /api/tableName/:id | Delete a row by primary key
POST | /api/tableName/:tripId/:newuserId | Duplicates a row by primary key then change user_id (only trip_overview)
GET | /api/tableName/filterName/:id | Retrieves rows by filter (except country)

The follow table is for trip_detail only.
HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
POST | /api/tableName | Create a new row
GET | /api/tableName/:id | Retrieves a row by trip_id
PUT | /api/tableName/:tripId/:day/:order | Updates row element by composite primary key i.e. trip_id, day, and order
POST | /api/tableName/:tripId/:newuserId/:newtripId | Duplicates a row by trip_id then change user_id and trip_id 
DELETE | /api/tableName/trip/:id | Delete a row by trip_id
DELETE | /api/tableName/trip/:id/:day/:order | Delete a row by composite primary key i.e. trip_id, day, and order
DELETE | /api/tableName/user/:id | Delete a row by user_id