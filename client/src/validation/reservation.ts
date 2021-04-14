const required = true;

const workspace = {required, name: "workspace"};
const requester = {required, name: "requester"};
const from = {required};
const to = {required};

export const rules = {requester, from, to, workspace};
