import * as Parse from 'parse/node';
import { ErrorCodes, ParseError } from './util';

export default class Profile extends Parse.Object {
    static invalidUsernameCharacters = /[^a-zA-Z0-9\-_.]/;
    static requiredUsernameCharacters = /[a-zA-Z0-9]/;
    static nonSearchableUsernameCharacters = /[^a-zA-Z0-9]/g;

    constructor() {
        super('Profile');
    }

    get realName(): string {
        return this.get('realName');
    }

    set searchableUsername(newValue: string) {
        this.set('searchableUsername', newValue);
    }

    get username(): string {
        return this.get('username');
    }

    setSearchableUsername() {
        if (!this.username) {
            return
        }

        this.searchableUsername = this.username.replace(Profile.nonSearchableUsernameCharacters, '');
    }

    validateUsername() {
        if (!this.username) {
            return
        }

        if (Profile.invalidUsernameCharacters.test(this.username)) {
            throw ParseError(ErrorCodes.badRequest, 'Invalid Username', 'Usernames may only contain letters, numbers, underscores, hyphens, and periods.');
        } else if (!Profile.requiredUsernameCharacters.test(this.username)) {
            throw ParseError(ErrorCodes.badRequest, 'Invalid Username', 'Your username must contain at least one letter or number.');
        }
    }
}