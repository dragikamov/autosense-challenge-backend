# autoSense Challenge Backend

## Database

To start the backend, first the database needs to be started. I have created a docker-compose script that would run the database and enter the sample data in the database. It is assumed that the computer's port 3306 is free. To start it enter into the `fuel_stations_database` directory with the terminal and run `docker-compose up -d`.

## API Installation

1. Installation locally

- After the database has been started the backend dependencies can be installed by `npm install` after which the backend can be started by running `npm start`.

2. Installation using Docker

- While being in the `autosense-challenge-backend` directory run `docker-compose up --build -d`. After it builds the API would be accessible on [localhost:4000](localhost:4000).

## Tests

- To run the tests you can simply run `npm run test` after having installed the dependencies using `npm install`.

## Documentation

- The API documentation can be found on [localhost:4000/api-docs](localhost:4000/api-docs) after the backend has been started.

## Authorization Token

- If the Authorization Token is needed, one can be obtained from [localhost:4000/](localhost:4000/). It would need to be put in the Autorization parameter of a request's header WITHOUT the "Bearer " prefix.

## Deployed on

- Backend deployed on [https://autosensechallenge.dragikamov.com/](https://autosensechallenge.dragikamov.com/)
