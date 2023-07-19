import { error, notice, setOutput } from "@actions/core";
import { exec } from "@actions/exec";
import { debug } from "console";
import { compare, inc, parse } from "semver";

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
	debug("Max version is v" + max);
	setOutput("deploy", "yes");
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const newVersion = parse(max)?.inc?.(increment) || undefined;
	if (!newVersion) {
		throw new Error("Could not increment version!");
	}
	console.log("new version = v%s", newVersion);
	setOutput("version", "v" + newVersion);
	notice("New version is v" + newVersion);
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
		.map((line) => line.substring(52))
		.filter((tag) => REGEX.test(tag));
}
