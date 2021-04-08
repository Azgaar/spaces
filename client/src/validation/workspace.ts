const required = true;

const description = {required, minLength: 2, maxLength: 256};
const status = {required, name: "status", minLength: 2, maxLength: 32};
const type = {required, name: "type", minLength: 2, maxLength: 32};
const size = {required, min: 1, max: 256, valueAsNumber: true};
const equipment = {required};

export const rules = {description, status, type, size, equipment};
