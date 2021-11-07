import { CheckDocument } from "../models/check";

export const bindUrl = (check: CheckDocument) : string => {
    let url = `${check.protocol}://${check.url}`;

    if(typeof check.port !== "undefined") url += `:${check.port}`;
    if(typeof check.path !== "undefined") url += `${check.path}`;

    return url;
};