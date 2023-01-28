# An app to optimize the way people manage their personal finances

## Steps to run the dev environment locally:

- from the root directory, head over to `cd backend`
- Run `npm install` and this will create a `node_modules` directory in the backend directory, which contains all the required packages to run the backend.

- Run `mkdir config` and place the `dev.env` file under there to be able to upload secrets to the dev backend.
- Before you can run the backend, you need a local MongoDB cluster running, so make sure your MonoDB database is running locally.

- In order to run the backend, run `npm run dev` from the root dir. This should start up the backend server at `https://localhost:3001`

- Similarly from the root dir of `cd frontend` and run `npm install` to install all the required node_modules for the frontend.

- Similarly, run `mkdir config` and place the `dev.env` file to upload the frontend secrets.

- Then from the root, run `npm run dev` to spin up the frontend at `http://localhost:5103`

Feel free to ask any questions

