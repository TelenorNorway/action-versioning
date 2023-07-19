"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const REGEX = /^([0-9]+\.[0-9]+\.[0-9]+)$/g;
function commit(version) {
    if (!REGEX.test(version)) {
        throw new Error("Invalid version input, expected X.Y.Z, example 1.2.3");
    }
    (0, core_1.setOutput)("version", "v" + version);
    (0, core_1.setOutput)("deploy", "yes");
}
exports.default = commit;
