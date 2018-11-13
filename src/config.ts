require('dotenv').load();
import * as log from './logger';

// Load optional config vars from process.env.
function missingOptionalConfig<T>(parameter: string, defaultValue: T): T {
    log.warning(`Missing \`${parameter}\`, defaulting to \'${defaultValue}\'...`);
    return defaultValue;
}

export const appName = process.env.APP_NAME || missingOptionalConfig('APP_NAME', 'Island');
export const dashboardMountPoint = process.env.DASHBOARD_MOUNT_POINT || missingOptionalConfig('DASHBOARD_MOUNT_POINT', '/dashboard');
export const databaseURI = process.env.DATABASE_URI || missingOptionalConfig('DATABASE_URI', 'mongodb://localhost:27017/dev');
export const environment = process.env.NODE_ENV || missingOptionalConfig('NODE_ENV', 'DEV');
export const logLevel = process.env.LOG_LEVEL || missingOptionalConfig('LOG_LEVEL', 'verbose');
export const mountPoint = process.env.MOUNT_POINT || missingOptionalConfig('MOUNT_POINT', '/parse');
export const port = process.env.PORT || missingOptionalConfig('PORT', 1337);

export const dashboardURL = `http://localhost:${port}${dashboardMountPoint}`;
export const serverURL = `http://localhost:${port}${mountPoint}`;
export const publicServerURL = process.env.PUBLIC_SERVER_URL || missingOptionalConfig('PUBLIC_SERVER_URL', null);

// Load required config vars from process.env.
let shouldAbort = false;
function missingRequiredConfig(parameter: string) {
    log.error(`Missing \`${parameter}\`. Please provide it through an environment variable or a .env file.`);
    shouldAbort = true;
}

export const appId = process.env.APP_ID || missingRequiredConfig('APP_ID');
export const masterKey = process.env.MASTER_KEY || missingRequiredConfig('MASTER_KEY');
export const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || missingRequiredConfig('TWILIO_PHONE_NUMBER');
export const twilioSID = process.env.TWILIO_SID || missingRequiredConfig('TWILIO_SID');
export const twilioToken = process.env.TWILIO_TOKEN || missingRequiredConfig('TWILIO_TOKEN');

shouldAbort && process.abort();
