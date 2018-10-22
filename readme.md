# island_server
The Parse Server instance for Island.

## Parse Server Intro
Parse Server is a backend platform written in Node that can be deployed anywhere and includes out of the box support for common things like object storage, push notifications, basic authentication, file storage, etc. It's backed by MongoDB and you can use a variety of solutions for large file storage.
* [Parse Platform Website](https://parseplatform.org)
* [Android Guide](https://docs.parseplatform.org/android/guide/)
* [iOS Guide](https://docs.parseplatform.org/ios/guide/)
* [Parse Server Guide](https://docs.parseplatform.org/parse-server/guide/)

## Deploying Locally
* `git clone` this repository and run `npm install`.
* [Install MongoDB](https://docs.mongodb.com/manual/installation/).
* Ensure that there's a MongoDB instance running on your computer ([Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#start-mdb-edition-from-the-command-interpreter) and [macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb)). You'll need to do this every time you want to run this server locally, or else it won't be able to connect to the database and it won't start. If you want, use MongoDB Atlas or some other MongoDB service to create a hosted Mongo instance and then set the `DATABASE_URI` config to the URL for it.
* `npm start`. You'll see that the script will print out a bunch of errors and then abort. You're missing some config variables. To fix this, create a new file in the root of the project called `.env`, and add the config variables the script says to add. Some are optional and the log statements are just warnings. Others are required. All config variables can be added to your `.env` in the format `KEY="VALUE"`.