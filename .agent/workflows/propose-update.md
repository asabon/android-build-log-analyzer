---
description: Propose changes to the shared configuration
---

1. Ask the user for the "Description of changes" and the "Desired Branch Name" (e.g., `feat/add-new-rule`).
2. Move to the `.shared-config` directory.
3. Fetch the latest updates to ensure base is up-to-date: `git fetch origin`.
4. Create and switch to the new branch: `git checkout -b <branch-name> origin/main`.
5. Perform the changes requested by the user (edit files in `.shared-config`).
6. Confirm with the user that the changes are correct.
7. Commit the changes: `git commit -am "<description>"`.
8. Push the branch to the remote: `git push origin <branch-name>`.
9. Provide the user with the URL to create a Pull Request (usually `https://github.com/<org>/<repo>/compare/<branch-name>?expand=1`).
10. Cleanup:
    - Switch back to the main branch: `git checkout main` (or the detached head state as defined in parent).
    - Sync the submodule back to the parent project's registered commit: `git submodule update`.
    - Inform the user that the local environment has been reset to the original state to keep the parent project clean.
