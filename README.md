# autoSense Challenge Backend

- To start the backend, first the database needs to be started. I have created a docker-compose script that would run the database and enter the sample data in the database. It is assumed that the computer's port 3306 is free.

- After the database has been started the backend dependencies can be installed by `npm install` after which the backend can be started by running `npm start`.

- To run the tests you can simply run `npm run test`.

- The API documentation can be found on [localhost:4000/api-docs](localhost:4000/api-docs) after the backend has been started.