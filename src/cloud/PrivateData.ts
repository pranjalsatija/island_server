import * as Parse from 'parse/node';

export default class PrivateData extends Parse.Object {
    constructor() {
        super('PrivateData');
    }

    get passwordSecret(): string {
        return this.get('passwordSecret');
    }

    set passwordSecret(newValue: string) {
        this.set('passwordSecret', newValue);
    }

    get phoneNumber(): string {
        return this.get('phoneNumber');
    }

    set phoneNumber(newValue: string) {
        this.set('phoneNumber', newValue);
    }

    get user(): Parse.User {
        return this.get('user');
    }

    set user(newValue: Parse.User) {
        this.set('user', newValue);
    }
}