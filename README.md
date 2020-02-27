## How to run json-server (faked backend)

### `npx json-server --watch db.json --port 3030`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Wanplan REST API Ver 1.2.0 Overview

Table | Primary Key | Available Filter
------------ | ------------- | -------------
attraction | attraction_id | city, style
city | city_id | prefecture, region, country
country | country_id | -
transport | - | -
plan_detail | - | -
plan_overview | plan_id | user, city, style
plan_startday | - | -
user | user_id | username, email

The follow table is for all table except plan_detail.

HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
GET | /api/plan/:planId | Retrieves information from table attraction, city, country, plan_detail, plan_overview, plan_startday, and user by plan_id
GET | /api/tableName | Lists rows of table
POST | /api/tableName | Create a new row
GET | /api/tableName/:id | Retrieves a row by primary key (except country)
PUT | /api/tableName/:id | Updates row element by primary key (except city, country)
DELETE | /api/tableName/:id | Delete a row by primary key
POST | /api/tableName/:planId/:newuserId | Duplicates a row by primary key then change user_id (only plan_overview)
GET | /api/tableName/filterName/:id | Retrieves rows by filter (except country)


The follow table is for plan_detail only.

HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
POST | /api/plan_detail | Create a new row
GET | /api/plan_detail/:id | Retrieves a row by plan_id
PUT | /api/plan_detail/:planId/:day/:order | Updates row element by composite primary key i.e. plan_id, day, and order
POST | /api/plan_detail/:planId/:newplanId | Duplicates a row by plan_id then change user_id and plan_id 
DELETE | /api/plan_detail/delete/:id | Delete a row by plan_id
DELETE | /api/plan_detail/delete/:id/:day/:order | Delete a row by composite primary key i.e. plan_id, day, and order

The follow table is for transport only.

HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
POST | /api/transport | Create a new row
GET | /api/transport/find/from/:sourceId | Retrieves rows by source_id
GET | /api/transport/find/to/:destinationId | Retrieves rows by destination_id
GET | /api/transport/find/:sourceId/:destinationId | Retrieves a row by source_id and destination_id
PUT | /api/transport/:sourceId/:destinationId | Updates row element by composite primary key i.e. source_id and destination_id 
DELETE | /api/transport/delete/from/:sourceId | Delete rows by source_id
DELETE | /api/transport/delete/to/:destinationId | Delete rows by destination_id
DELETE | /api/transport/delete/:sourceId/:destinationId | Delete a row by source_id and destination_id

The follow table is for plan_startday only.

HTTP Type | API URL | Comments
------------ | ------------- | ------------- 
POST | /api/plan_startday | Create a new row
GET | /api/plan_startday/:planId | Retrieves a row by plan_id
PUT | /api/plan_startday/:planId/:day | Updates row element by composite primary key i.e. plan_id and day 
POST | /api/plan_startday/:planId/:newPlanId | Duplicates a row by plan_id then change plan_id 
DELETE | /api/plan_startday/delete/:planId | Delete rows by plan_id
DELETE | /api/plan_startday/delete/:planId/:day | Delete a row by composite primary key i.e. plan_id and day
