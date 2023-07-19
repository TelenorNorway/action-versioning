import { setOutput } from "@actions/core";

const REGEX = /^([0-9]+\.[0-9]+\.[0-9]+)$/g;

export default function commit(version: string) {
	if (!REGEX.test(version)) {
		throw new Error("Invalid version input, expected X.Y.Z, example 1.2.3");
	}
	setOutput("version", "v" + version);
	setOutput("deploy", "yes");
}
