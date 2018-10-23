import * as config from './config';
import * as log from './logger';

import express from 'express';
import { ParseServer } from 'parse-server';
import * as path from 'path';

// Hardcoded config vars.
const allowClientClassCreation = (config.environment == 'DEV');
const cloud = path.join(__dirname, 'cloud/main.js');
const cluster = true;
const objectIdSize = 16;
const revokeSessionOnPasswordReset = false;
const serverURL = `http://localhost:${config.port}${config.mountPoint}`;

// Configure API.
const server = express();
const api = new ParseServer({ 
    allowClientClassCreation, 
    appId: config.appId,
    cloud,
    cluster,
    databaseURI: config.databaseURI,
    logLevel: config.logLevel,
    masterKey: config.masterKey,
    objectIdSize,
    revokeSessionOnPasswordReset,
    serverURL
});

server.use(config.mountPoint, api);

server.listen(config.port, () => {
    log.info(`Listening at ${serverURL}.`);
});