// Load .env if needed.
require('dotenv').load();

// Imports
import express from 'express';
import { ParseServer } from 'parse-server';

// Load config vars from process.env.
let shouldAbort = false;

function missingOptionalParameter<T>(parameter: string, defaultValue: T): T {
    console.warn(`Missing \`${parameter}\`, defaulting to \'${defaultValue}\'...`);
    return defaultValue;
}

function missingRequiredParameter(parameter: string) {
    console.error(`Missing \`${parameter}\`. Please provide it through an environment variable or a .env file.`);
    shouldAbort = true;
}

const appId = process.env.APP_ID || missingRequiredParameter('APP_ID');
const databaseURI = process.env.DATABASE_URI || missingOptionalParameter('DATABASE_URI', 'mongodb://localhost:27017/dev');
const logLevel = process.env.LOG_LEVEL || missingOptionalParameter('LOG_LEVEL', 'verbose');
const masterKey = process.env.MASTER_KEY || missingRequiredParameter('MASTER_KEY');
const mountPoint = process.env.MOUNT_POINT || missingOptionalParameter('MOUNT_POINT', '/parse');
const port = process.env.PORT || missingOptionalParameter('PORT', 1337);
const serverURL = `http://localhost:${port}${mountPoint}`;

shouldAbort && process.abort();

// Hardcoded config vars. These aren't meant to change, they're just in separate variables for documentation / object shorthand syntax.
const allowClientClassCreation = false;
const objectIdSize = 16;
const revokeSessionOnPasswordReset = false;

// Set up server and mount.
const server = express();
const api = new ParseServer({ allowClientClassCreation, appId, databaseURI, logLevel, masterKey, objectIdSize, revokeSessionOnPasswordReset, serverURL });

server.use(mountPoint, api);
server.listen(port, () => {
    console.log(`Listening at ${serverURL}.`);
});