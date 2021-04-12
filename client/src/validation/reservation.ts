const required = true;

const requester = {required};
const status = {required, name: "status", minLength: 2, maxLength: 32};

export const rules = {requester, status};
