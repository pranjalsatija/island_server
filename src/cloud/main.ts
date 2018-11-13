import * as config from '../config';
import { beforeSave, define, ErrorCodes, validatePhoneNumber, sendSMS, ParseError } from './util';
import { default as Profile } from './Profile';
import { default as PrivateData } from './PrivateData';

import { randomBytes } from 'crypto';
import { generate as randomString } from 'randomstring';

Parse.Object.registerSubclass('PrivateData', PrivateData);
Parse.Object.registerSubclass('Profile', Profile);

// Cloud Functions
define('requestVerificationCode', async (request) => {
    const phoneNumber = validatePhoneNumber(request.params.phoneNumber, request.params.region);
    
    const query = new Parse.Query(PrivateData);
    query.equalTo('phoneNumber', phoneNumber);
    query.include('user');
    
    const privateData = await query.first({ useMasterKey: true });
    const verificationCode = randomString({
        charset: 'numeric',
        length: 6
    });

    if (privateData) {
        const passwordSecret = privateData.passwordSecret;
        const user = privateData.user;
        user.setPassword(passwordSecret + verificationCode);
        await user.save(null, { useMasterKey: true });
    } else {
        const username = (await randomBytes(16)).toString('hex');
        const passwordSecret = (await randomBytes(16)).toString('hex');

        const user = new Parse.User();
        user.setUsername(username);
        user.setPassword(passwordSecret + verificationCode);

        const privateData = new PrivateData();
        privateData.passwordSecret = passwordSecret;
        privateData.phoneNumber = phoneNumber;
        privateData.user = user;

        await privateData.save(null, { useMasterKey: true });
    }

    // This makes testing easier; you don't need to wait for the SMS.
    if (config.environment == 'DEV') {
        return verificationCode;
    } else {
        await sendSMS(phoneNumber, `Your verification code for ${config.appName} is ${verificationCode}.`);
        return 'Code sent.'
    }
});

define('completePhoneVerification', async (request) => {
    const verificationCode = request.params.verificationCode;
    if (!verificationCode) {
        throw ParseError(ErrorCodes.badRequest, 'Missing Verification Code', 'Please provide a verification code.');
    }

    const phoneNumber = validatePhoneNumber(request.params.phoneNumber, request.params.region);
    const query = new Parse.Query(PrivateData);
    query.equalTo('phoneNumber', phoneNumber);
    query.include('user');

    const privateData = await query.first({ useMasterKey: true });
    if (!privateData) {
        throw ParseError(ErrorCodes.notFound, 'Code Not Found', 'We were unable to find a verification code for that phone number.');
    }

    const username = privateData.user.getUsername();
    const password = privateData.passwordSecret + verificationCode;

    try {
        const user = await Parse.User.logIn(username as string, password);
        return user.getSessionToken();
    } catch (error) {
        throw ParseError(ErrorCodes.badRequest, 'Invalid Verification Code', 'The provided verification code was invalid.');
    }
});

// Before Save Hooks
beforeSave('Profile', async (request) => {
    const profile: Profile = (request as any).object;

    if (!profile.realName) {
        throw ParseError(ErrorCodes.badRequest, 'Real Name Required', 'You must provide a real name.');
    }

    profile.validateUsername();
    profile.setSearchableUsername();

    const query = new Parse.Query(Profile);
    query.equalTo('username', profile.username);
    const matchingProfile = await query.first({ useMasterKey: true });

    if (matchingProfile && matchingProfile.id != profile.id) {
        throw ParseError(ErrorCodes.badRequest, 'Username Taken', 'That username is taken.');
    }
});
