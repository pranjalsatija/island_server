// Load .env if needed.
require('dotenv').load();


// Imports
import express from 'express';
import { ParseServer } from 'parse-server';
import * as path from 'path';


// Load optional config vars from process.env.
function missingOptionalConfig<T>(parameter: string, defaultValue: T): T {
    console.warn(`[island_server] WARNING: Missing \`${parameter}\`, defaulting to \'${defaultValue}\'...`);
    return defaultValue;
}

const databaseURI = process.env.DATABASE_URI || missingOptionalConfig('DATABASE_URI', 'mongodb://localhost:27017/dev');
const logLevel = process.env.LOG_LEVEL || missingOptionalConfig('LOG_LEVEL', 'verbose');
const mountPoint = process.env.MOUNT_POINT || missingOptionalConfig('MOUNT_POINT', '/parse');
const port = process.env.PORT || missingOptionalConfig('PORT', 1337);


// Load required config vars from process.env.
let shouldAbort = false;

function missingRequiredConfig(parameter: string) {
    console.error(`[island_server] ERROR: Missing \`${parameter}\`. Please provide it through an environment variable or a .env file.`);
    shouldAbort = true;
}

const appId = process.env.APP_ID || missingRequiredConfig('APP_ID');
const masterKey = process.env.MASTER_KEY || missingRequiredConfig('MASTER_KEY');
const serverURL = `http://localhost:${port}${mountPoint}`;

shouldAbort && process.abort();


// Hardcoded config vars. These aren't meant to change, they're just in separate variables for documentation / object shorthand syntax.
const allowClientClassCreation = false;
const cloud = path.join(__dirname, 'cloud/main.js');
const objectIdSize = 16;
const revokeSessionOnPasswordReset = false;


// Set up server and mount.
const server = express();
const api = new ParseServer({ allowClientClassCreation, appId, cloud, databaseURI, logLevel, masterKey, objectIdSize, revokeSessionOnPasswordReset, serverURL });

server.use(mountPoint, api);
server.listen(port, () => {
    console.log(`Listening at ${serverURL}.`);
});