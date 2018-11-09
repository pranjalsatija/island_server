// Imports
import * as config from '../config';
import * as log from '../logger';

import * as Parse from 'parse/node';
import * as twilio from 'twilio';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';


// Errors
export class ErrorCodes {
    static badRequest = 400;
    static notFound = 404;
}

export function ParseError(code: any, error: any, description: any): any {
    return { code, error, description };
}


// Cloud Code
export function define(name: string, fxn: (request: Parse.Cloud.FunctionRequest) => any) {
    log.verbose(`Defining /functions/${name}.`);
    Parse.Cloud.define(name, fxn);
}


// Twilio
let smsClient: twilio.RestClient = new twilio.RestClient(config.twilioSID as string, config.twilioToken as string);

export function validatePhoneNumber(phoneNumber: any, region: any) {
    const badPhoneNumberError = ParseError(ErrorCodes.badRequest, 'Invalid Phone Number', `The phone number '${phoneNumber}' is invalid for the region '${region}'.`);

    if (!phoneNumber) {
        throw ParseError(ErrorCodes.badRequest, 'Missing Phone Number', 'Please provide a phone number.');
    }

    if (!region) {
        throw ParseError(ErrorCodes.badRequest, 'Missing Region', 'Please provide a region.');
    }

    const phoneNumberFormatter = PhoneNumberUtil.getInstance();
    let parsedPhoneNumber: libphonenumber.PhoneNumber;

    try {
        parsedPhoneNumber = phoneNumberFormatter.parse(phoneNumber, region);
    } catch (_) {
        throw badPhoneNumberError;
    }
    
    if (phoneNumberFormatter.isValidNumberForRegion(parsedPhoneNumber, region)) {
        return phoneNumberFormatter.format(parsedPhoneNumber, PhoneNumberFormat.E164);
    } else {
        throw badPhoneNumberError;
    }
}

export async function sendSMS(phoneNumber: string, message: string) {
    await smsClient.messages.create({
        body: message,
        from: config.twilioPhoneNumber,
        to: phoneNumber
    });
}