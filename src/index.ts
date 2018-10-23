import * as config from './config';
import * as log from './logger';

import express from 'express';
import { default as ParseDashboard } from 'parse-dashboard';
import { ParseServer } from 'parse-server';
import * as path from 'path';

// Hardcoded config vars.
const allowClientClassCreation = (config.environment == 'DEV');
const cloud = path.join(__dirname, 'cloud/main.js');
const cluster = true;
const objectIdSize = 16;
const revokeSessionOnPasswordReset = false;

const dashboardURL = `http://localhost:${config.port}${config.dashboardMountPoint}`;
const serverURL = `http://localhost:${config.port}${config.mountPoint}`;

// Configure dashboard and Express server.
const server = express();
if (config.environment == 'DEV') {
    log.info(`DEV environment detected. Setting up dashboard at ${dashboardURL}.`);
    const dashboard = ParseDashboard({
        // apps: [{ serverURL, appId, masterKey, appName }]
        apps: [
            {
                serverURL,
                appId: config.appId,
                masterKey: config.masterKey,
                appName: config.appName,
            }
        ]
    }, { allowInsecureHTTP: true });

    server.use('/dashboard', dashboard);
} else {
    log.info(`Detected NODE_ENV ${config.environment}. Disabling dashboard.`);
}

// Configure API.
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