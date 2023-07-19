import { setOutput } from "@actions/core";

const REGEX = /^v=([0-9]+\.[0-9]+\.[0-9]+)($|[\s:])/;

export default function commit(message: string) {
	const version = message.match(REGEX)?.[1];
	if (!version) {
		setOutput("version", null);
		setOutput("deploy", "no");
		return;
	}
	setOutput("version", "v" + version);
	setOutput("deploy", "yes");
}
