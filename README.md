[![unit-test](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml/badge.svg?branch=main&event=push)](https://github.com/asabon/android-build-log-analyzer/actions/workflows/test.yml)

# Android Build Log Analyzer

[Japanese (日本語)](./README.ja.md)


This GitHub Action analyzes Android build logs to detect and annotate errors and warnings.
It designed to help developers quickly identify issues in their build process directly within the GitHub Actions UI.

<!-- START_DEMO_REPORT -->

## Android Build Log Analysis

### Build Performance Summary

- **Total Build Time**: 12s
- **Total Tasks**: 12
  - Executed: 7
  - CACHED / UP-TO-DATE: 3
  - SKIPPED: 1


### Error and Warning Analysis

Found **3** errors and **3** warnings.

| Type | Lines | Message |
| :--- | :--- | :--- |
| 🛑 Error | 7, 10 | `e: /path/to/MainActivity.kt: (10, 20): Unresolved reference: User` |
| 🛑 Error | 22 | `> Compilation error. See log for more details` |
| ⚠️ Warning | 11, 12 | `w: /path/to/Utils.kt: (5, 12): Parameter 'context' is never used` |
| ⚠️ Warning | 13 | `w: /path/to/Other.kt: (8, 1): Deprecated usage` |


<!-- END_DEMO_REPORT -->

## Usage

Add the following step to your workflow, typically after the build step that generates the log file.


```yaml
- name: Analyze Build Log
  uses: asabon/android-build-log-analyzer@v0
  if: always() # Run even if the build failed
  with:
    log-file-path: 'path/to/your/build.log'
```

## Inputs

| Input | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `log-file-path` | The path to the Android build log file to analyze. | **Yes** | N/A |
| `report-path` | The path to save the analysis report in Markdown format. | No | N/A |

## Behavior

The action parses the provided log file line by line and looks for specific keywords (case-insensitive):

- **Error Detection**: Lines containing `error` are reported as **Error** annotations. If at least one error is found, the action will fail.
- **Warning Detection**: Lines containing `warning` are reported as **Warning** annotations.

## Contributing

For information on how to build, test, and use this action locally, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

