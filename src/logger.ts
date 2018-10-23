let logLevel = 'verbose';

export function setLogLevel(newLevel: string) {
    logLevel = newLevel;
}

export function error(thing: any) {
    console.log(`[island_server] ERROR: ${JSON.stringify(thing)}`);
}

export function info(thing: any) {
    console.log(`[island_server] INFO: ${JSON.stringify(thing)}`);
}

export function verbose(thing: any) {
    (logLevel == 'verbose') && console.log(`[island_server] VERBOSE: ${JSON.stringify(thing)}`);
}

export function warning(thing: any) {
    console.log(`[island_server] WARNING: ${JSON.stringify(thing)}`);
}