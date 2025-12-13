---
description: Check for updates from the shared configuration submodule
---

1. Check if the `.shared-config` directory exists. If not, inform the user that the shared configuration submodule is missing.
2. Update the shared configuration:
   - Run `git submodule update --remote .shared-config` (or `git pull` inside the directory) to fetch the latest changes.
3. Compare the configurations:
   - Compare `.agent/AGENT.md` with `.shared-config/.agent/AGENT.md`.
   - Compare files in `.agent/workflows/` with `.shared-config/.agent/workflows/`.
4. Report the results:
   - List any files that have changed in the shared configuration.
   - Show a summary of the differences (diff).
   - Ask the user if they want to update specific files (Option B users) or if they simply needed to know the changes (Option A users).
