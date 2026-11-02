---
{id: HANDOFF-DATA-ENGINE-PROMPT-2,name: Paste prompt for the next data engine chat,type: handoff,tags: [data-engine,admin,handoff]}
---

# Paste prompt

You are continuing the Mzizi Africa repository (main checkout `/home/alidante/Projects/research/alidantech-org/mzizi-africa/mzizi.africa`, branch `develop`; never create branches or worktrees, never push, do not touch `.github`). Read, in order: `AGENTS.md`, `.docs/handoffs/data-engine-handoff-2.md` (it holds the full state, the user's decisions, commands and traps), `.docs/docs/DATA_ENGINE_STATUS_AND_GAPS.md`, `.docs/docs/LEGALITY_SAFETY_AND_COMPLIANCE.md`. Every unit of work goes through the Task CLI (`task list`, then `task show TSK-6EF29D43B416`, `TSK-1715145DF579`, `TSK-22C8B63A4B43`); run `task validate` after `.docs` changes and keep checklists true.

The user wants: an admin site in `source/apps/web` (reuse the existing Next.js app with a better CSS design and the Bun runtime) to manage and view backend data and above all approve data that is in extraction or on hold; reviewer-only NestJS endpoints (Dryv-authored) behind it with localhost dev-token sign-in; and extraction that works from now on (site extraction, PDF extraction, Tesseract OCR with English and Swahili) with data recorded in the real canonical tables through the existing staging, review and promotion path.

First, ask the user for the two pending inputs: that they ran `sudo dnf install -y tesseract tesseract-langpack-eng tesseract-langpack-swa`, and the monitored contact address plus bot page URL for `MZIZI_USER_AGENT`. Do not use their own email as a contact. No live requests to real sites until the user agent resolves, a human has approved an assessment for that site in the admin, and the dossier is at pilot. Agents never approve assessments or data. Then run the baseline test suites listed in the handoff and start with the reviewer API task.
