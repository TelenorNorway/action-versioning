"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const console_1 = require("console");
const semver_1 = require("semver");
const REGEX = /^([0-9]+\.[0-9]+\.[0-9]+)$/g;
async function commit(increment, token, repository) {
    switch (increment) {
        case "major":
        case "minor":
        case "patch":
            break;
        default:
            throw new Error(`Invalid increment type '${increment}'`);
    }
    const versions = await getTags(token, repository);
    if (versions.length === 0) {
        (0, core_1.setOutput)("deploy", "yes");
        (0, core_1.setOutput)("version", "v0.1.0");
        (0, core_1.notice)("No previous versions, defaulting to v0.1.0");
        return;
    }
    let max = versions[0];
    for (let i = 1; i < versions.length; i++) {
        const version = versions[i];
        if ((0, semver_1.compare)(version, max) === 1) {
            max = version;
        }
    }
    (0, core_1.setOutput)("deploy", "yes");
    (0, core_1.setOutput)("version", "v" + max);
    (0, core_1.notice)("New version is v" + max);
}
exports.default = commit;
async function getTags(token, repository) {
    let out = "";
    const code = await (0, exec_1.exec)("git", ["ls-remote", "--tags", `https://${token}:@github.com/${repository}.git`], {
        silent: true,
        ignoreReturnCode: true,
        listeners: {
            stdout: (data) => ((out += data.toString()), undefined),
            stderr: (data) => ((out += data.toString()), undefined),
        },
    });
    if (code !== 0) {
        (0, core_1.error)(out);
        throw new Error("Could not list tags");
    }
    (0, console_1.debug)(out);
    return out
        .split(/[\r\n]+/g)
        .map((line) => line.substring(41))
        .filter((tag) => REGEX.test(tag));
}
