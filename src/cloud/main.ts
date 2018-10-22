import * as Parse from 'parse/node';

console.log('Configuring cloud code.');

Parse.Cloud.define('echo', async (request) => {
    return request.params;
});