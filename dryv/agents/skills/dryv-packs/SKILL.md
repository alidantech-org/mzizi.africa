---
name: dryv-packs
description: Modify local Dryv packs, templates, capability bindings and generation output in this project.
---

<!-- dryv:begin -->
# dryv-packs

Read ../../../README.md and the packs configured in root dryv.yaml. Inspect the relevant dryv.pack.yaml, pack README, and tests before changing templates. Packs consume canonical IR projections; Template Servers own syntax analysis and rendering while the Engine decides output plans. Use explicit capability bindings and declared destinations. Validate the pack with dryv check <pack-path>, then preview project generation. Keep pack-specific .dryvignore behavior distinct from project ignore settings. Do not invent filesystem paths or hidden conventions.
<!-- dryv:end -->
