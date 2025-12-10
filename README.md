[![unit-test](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml)

# Android Build Log Analyzer

[Japanese (日本語)](./README.ja.md)


This GitHub Action analyzes Android build logs to detect and annotate errors and warnings.
It designed to help developers quickly identify issues in their build process directly within the GitHub Actions UI.

## Usage

Add the following step to your workflow, typically after the build step that generates the log file.

### Using from Marketplace (Recommended)

```yaml
- name: Analyze Build Log
  uses: asabon/android-build-log-analyzer@v1
  if: always() # Run even if the build failed
  with:
    log-file-path: 'path/to/your/build.log'
```

## Inputs

| Input | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `log-file-path` | The path to the Android build log file to analyze. | **Yes** | N/A |

## Behavior

The action parses the provided log file line by line and looks for specific keywords (case-insensitive):

- **Error Detection**: Lines containing `error` are reported as **Error** annotations. If at least one error is found, the action will fail.
- **Warning Detection**: Lines containing `warning` are reported as **Warning** annotations.

## Contributing

For information on how to build, test, and use this action locally, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

