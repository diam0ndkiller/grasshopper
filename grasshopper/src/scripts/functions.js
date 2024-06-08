import { format } from "date-fns";

export function long_time(timestamp) {
    return format(timestamp * 1000, "MM/dd/yyyy @ HH:mm");
}

export function short_time(timestamp) {
    let current_time = Date.now();
    let current_date = format(current_time, "MM/dd/yyyy");
    let timestamp_date = format(timestamp * 1000, "MM/dd/yyyy");
    if (current_date === timestamp_date) return format(timestamp * 1000, "HH:mm");
    else return format(timestamp * 1000, "MM/dd/yyyy");
}
/*
META-FUNCTION: until(condition) -> Promise
*/
export function until(conditionFunction) {
    const poll = resolve => {
        if(conditionFunction()) resolve();
        else setTimeout(_ => poll(resolve), 100);
    }
    return new Promise(poll);
}