const workspace = {required: "Consider selecting different time slot if no workspaces available", name: "workspace"};
const requester = {required: "The field is required", name: "requester"};

const type = {required: true, name: "type", minLength: 2, maxLength: 32};
const size = {required: true, min: 1, max: 256, valueAsNumber: true};
const equipment = {required: false, name: "equipment"};

export const rules = {requester, workspace, type, size, equipment};
