"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const console_1 = require("console");
const exact_1 = __importDefault(require("./strategies/exact"));
const semver_1 = __importDefault(require("./strategies/semver"));
const commit_1 = __importDefault(require("./strategies/commit"));
async function action() {
    const token = (0, core_1.getInput)("token", { required: true });
    const repository = (0, core_1.getInput)("repository", { required: true });
    const strategy = (0, core_1.getInput)("strategy", { required: true });
    const value = (0, core_1.getInput)("value", { required: true });
    switch (strategy) {
        case "exact":
            (0, console_1.debug)("Using exact");
            (0, exact_1.default)(value);
            break;
        case "semver":
            (0, console_1.debug)("Using semver");
            await (0, semver_1.default)(value, token, repository);
            break;
        case "commit":
            (0, console_1.debug)("Using commit");
            (0, commit_1.default)(value);
            break;
        default:
            throw new Error(`No strategy with the name '${strategy}'`);
    }
}
exports.default = action;
