# An app to optimize the way people manage their personal finances XDDDDDDDDDDDDDDDDDDDDDDDDDDD

## Steps to run the dev environment locally:

- from the root directory, head over to `cd backend`
- Run `npm install` and this will create a `node_modules` directory in the backend directory, which contains all the required packages to run the backend.

- Run `mkdir config` and place the `dev.env` file under there to be able to upload secrets to the dev backend.
- Before you can run the backend, you need a local MongoDB cluster running, so make sure your MonoDB database is running locally.

- In order to run the backend, run `npm run dev` from the root dir. This should start up the backend server at `https://localhost:3001`

- Similarly from the root dir of `cd frontend` and run `npm install` to install all the required node_modules for the frontend.

- Similarly, run `mkdir config` and place the `dev.env` file to upload the frontend secrets.

- Then from the root, run `npm run dev` to spin up the frontend at `http://localhost:5103`

## Contributing

The main branch has been protected by branch protection rules which will not allow you to commit directly to the main branch. Instead, for each new issue that you are working on:

1. Create a new branch via `git branch branch_name`. The branch_name should be intuitive for the issue you are working on and begin with a 'feat/' prefix for example, feat/chart-component if you are working on React Chart component.

2. If you already have a branch that you are staging on, then it is important that you alwasy ensure that you are not on the main branch, but on the desired feature branch. A safe way to do this is to run `git checkout branch_name` before you start making any commits. If a error message similar to "Please stash or push your commits before checking out" pop up, this likely means that you have screwed up in the past and made some commits on the main branch. In this case you can either `git rebase` if you are familiar with it, or contact me.

3. Push commits on your branch, and open a pull request from your branch to the main while you are developing.

4. Once the work is complete, each pull request requires at least one approval before ebing merged, so ask a relevant person for their review.

Feel free to ask me any questions beyond this guide
