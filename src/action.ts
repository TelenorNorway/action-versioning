import { getInput } from "@actions/core";
import { debug } from "console";
import exact from "./strategies/exact";
import semver from "./strategies/semver";
import commit from "./strategies/commit";

export default async function action() {
	const token = getInput("token", { required: true });
	const repository = getInput("repository", { required: true });
	const strategy = getInput("strategy", { required: true });
	const value = getInput("value", { required: true });

	switch (strategy) {
		case "exact":
			debug("Using exact");
			exact(value);
			break;
		case "semver":
			debug("Using semver");
			await semver(value, token, repository);
			break;
		case "commit":
			debug("Using commit");
			commit(value);
			break;
		default:
			throw new Error(`No strategy with the name '${strategy}'`);
	}
}
