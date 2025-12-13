---
description: Initialize session by reading project rules
---

1. Check for the existence of `.agent/config.yml`.
2. If `.agent/config.yml` exists, read it to determine the user's preferred language (e.g., `language: "ja"`).
3. If the file does not exist, check config.yml.sample to understand the structure, but default to English (or system default) if no config is present.
// turbo
4. Check for updates in the `.shared-config` submodule (if it exists).
   - Check if the `.shared-config` directory exists.
   - If it exists, check for updates (e.g., compare local commit with remote HEAD).
   - If updates are available, report to the user and ask if they want to update the submodule (`git submodule update --remote .shared-config`).
   - If the update is performed, remind users who are manualy managing config (Option B) to run `/check-updates` to review and merge changes.
5. Read .agent/AGENT.md.
6. Summarize the key rules and preferences to the user.
   - If a language is configured in `config.yml`, provide the summary in that language AND explicitly state that you will conduct the rest of this session in that language.
   - If no configuration is found, use the default language.
