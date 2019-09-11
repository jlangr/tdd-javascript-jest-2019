// ... or just use lodash
export const removeKey = ({[key]: _, ...rest}, key) => rest
