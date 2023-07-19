"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const REGEX = /^v=([0-9]+\.[0-9]+\.[0-9]+)($|[\s:])/;
function commit(message) {
    var _a;
    const version = (_a = message.match(REGEX)) === null || _a === void 0 ? void 0 : _a[1];
    if (!version) {
        (0, core_1.setOutput)("version", null);
        (0, core_1.setOutput)("deploy", "no");
        return;
    }
    (0, core_1.setOutput)("version", "v" + version);
    (0, core_1.setOutput)("deploy", "yes");
}
exports.default = commit;
