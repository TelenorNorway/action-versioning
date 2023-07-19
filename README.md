# Versioning

_Easily manage versioning for your repository_

## Usage

```yaml
- uses: TelenorNorway/action-versioning
	with:
		token: ${{ github.token }}
		repository: ${{ github.repository }}
		strategy: semver
		value: ${{ 'semver' || 'commit' || 'exact }}
```
