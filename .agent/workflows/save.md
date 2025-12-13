---
description: Save current progress to a timestamped file
---

// turbo
1. Get the current date and time in `YYYYMMDD_HHMM` format.
2. Create a summary of the current session (completed tasks, current status, next steps).
3. Save the summary to `.agent/work/progress_<TIMESTAMP>.md` using the `run_command` tool (as `.agent/work` is git-ignored and write_to_file is blocked).
   Example: `Set-Content -Path ".agent/work/progress_<TIMESTAMP>.md" -Value "content" -Encoding utf8`
4. Report to the user that the save is complete.
