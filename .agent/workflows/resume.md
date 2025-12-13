---
description: Resume work from the last progress report
---

// turbo
1. Execute the /init workflow.
2. Find the latest `progress_*.md` file in the `.agent/work` directory (determined by the date and time in the filename).
3. Read the content of that file.
4. Summarize the content and report to the user, then ask for further instructions. Report in the language specified by the user configuration.
