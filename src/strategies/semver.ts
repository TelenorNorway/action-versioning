import { error, notice, setOutput } from "@actions/core";
import { exec } from "@actions/exec";
import { debug } from "console";
import { compare } from "semver";

const REGEX = /^([0-9]+\.[0-9]+\.[0-9]+)$/g;

export default async function commit(
	increment: string,
	token: string,
	repository: string,
) {
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
		setOutput("deploy", "yes");
		setOutput("version", "v0.1.0");
		notice("No previous versions, defaulting to v0.1.0");
		return;
	}

	let max = versions[0];
	for (let i = 1; i < versions.length; i++) {
		const version = versions[i];
		if (compare(version, max) === 1) {
			max = version;
		}
	}
	setOutput("deploy", "yes");
	setOutput("version", "v" + max);
	notice("New version is v" + max);
}

async function getTags(token: string, repository: string): Promise<string[]> {
	let out = "";
	const code = await exec(
		"git",
		["ls-remote", "--tags", `https://${token}:@github.com/${repository}.git`],
		{
			silent: true,
			ignoreReturnCode: true,
			listeners: {
				stdout: (data) => ((out += data.toString()), undefined),
				stderr: (data) => ((out += data.toString()), undefined),
			},
		},
	);
	if (code !== 0) {
		error(out);
		throw new Error("Could not list tags");
	}
	debug(out);
	return out
		.split(/[\r\n]+/g)
		.map((line) => line.substring(42))
		.map((line) => (console.log(line), line))
		.filter((tag) => REGEX.test(tag));
}
