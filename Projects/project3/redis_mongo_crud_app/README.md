# Node/Express App with MongoDB and Redis

## Introduction

- This Node.js application is designed to manage appointment data using both MongoDB and Redis. MongoDB serves as the primary database, while Redis is used for caching to enhance performance. This README outlines the setup, functionalities, and usage of the application.

## Application Structure

`router.js`: Defines routes for the web application and handles HTTP requests.
`MongoUtils.js`: Contains utility functions for interacting with MongoDB.
`RedisUtils.js`: Provides utility functions for Redis operations such as getData, setData, and deleteData.

## Usage

1. Ensure redis and mongodb are running in background. 

2. Start the Application: Run the application with the command:

```shell
npm start
```

3. Accessing the Application: Visit `http://localhost:3000` in your web browser to interact with the application.

4. API Endpoints: The application offers several endpoints such as:

- `GET /`: Displays a list of appointments.
- `GET /appointment_detail/:id`: Fetches details of a specific appointment.
- `POST /add_appointment`: Adds a new appointment.
- `POST /update_appointment/:id`: Updates an existing appointment.
- `POST /delete_appointment/:id`: Deletes an appointment.

## Redis Integration

Redis is used to cache appointment details. When details of an appointment are requested, the application first checks Redis. If the data is not in the cache (cache miss), it fetches the data from MongoDB and then stores it in Redis for future requests (cache hit).

## Example 

![Demo How Redis Work in our environment] (/images/demo.png)
