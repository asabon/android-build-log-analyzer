# Antigravity Agent Configuration

This file contains the rules and preferences for the AI agent working on this project.

## Preferences

- **Language**: Japanese

## Rules

1. **Language Usage**:
   - Internal communications (chat, plans, tasks) and intermediate artifacts (e.g., `.agent/work/progress_*.md`) should be written in Japanese.
   - Public code comments, READMEs, and documentation (included in the codebase) must be written in English.

2. **Code & Behavior**:
   - Keep code changes minimal and clearly state the reason for the changes.
   - Do not make assumptions about unclear points; ask questions instead.
   - For better readability, use half-width parentheses `()` instead of full-width parentheses `（）`.

3. **Workspace Management**:
   - The `.agent/work` directory is git-ignored. If writing to this directory is required, create or edit files via `run_command` instead of standard tools. This method is permitted **ONLY** for the `.agent/work` directory.
