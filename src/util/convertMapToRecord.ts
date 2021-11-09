export const convertMapToObject = (metricArguments: Map<string, string>): Record<string, string> => {
    const newObject: Record<string, string> = {};
    for (const [key, value] of metricArguments) {
        newObject[key] = value;
    }
    return newObject;
};