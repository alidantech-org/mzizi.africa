---
id: HANDOFF-MOBILE-WEB-CONTINUATION-20261118
name: Mobile and web continuation verification
type: handoff
tags: [mobile,web,governance,verification]
---

# Continuation outcome and verification

## Implemented

The interrupted work was continued directly on develop with three parallel agents. Backend reads now handle empty categories, institution appointment filters, geographic comparison order and proxy ranking consistency. Constitution content exposes stored chapters, articles and full descendant clauses, with source provision and citation metadata. Profile UUIDs resolve legal basis and explanatory content. Generic caller-selected PDF regions read the real KNBS census publication: 47 unique counties, reconciled sex counts and aggregate 47,564,296; six footnote rows remain flagged and nothing was promoted.

Flutter now has the stationary decorated notched trophy, corrected Home header, connected governance graph and scope rail, institution directory/detail, Markdown/Constitution readers, legal links, comparison ladder and suggestions, populated initial rankings and layout-specific shimmer/error/empty states. Subsequent phone inspection found and fixed a sub-county suffix bug, repairing the saved parent ranking on launch. Maps, galleries, search states and zero-baseline explanations were also repaired. Web has corresponding governance, institutions, legal/content and comparison pages. Browser inspection found encoded-slash article routing and percentage multiplication bugs; both have regression coverage.

## Evidence and checks

The latest Android debug APK was built and installed on connected device 1420244e. Flutter screenshots under `.dev/shots/` include final-home.png (missing-data layout and repaired parent ranking), resume-tree.png and resume-leader-details.png (graph and sheet), resume-iebc.png (institution profile), final-chapter.png and final-article.png (chapter-to-full-article navigation), final-profile-dark-sw.png and final-rankings-dark-sw.png (dark theme and translated shell), and final-compare.png (hierarchy and explicit unavailable levels). The final provenance-label APK was rebuilt after these screenshots; see final-provenance-install.log for installation result. Temporary portrait lock was used during screenshots; original automatic rotation is restored after inspection.

Root `bun run check` passed: 696 Python tests passed with 35 skipped; API mock suite 5161 passed, 27 skipped and 54 pending; web eight tests passed. Backend separately reported database-backed 5188 tests and final targeted insight/extraction tests passing. Final Flutter analysis is clean and 22 tests pass. Web production build and Flutter web release build pass. Stack smoke checks pass after engine restart. Logs are in `.dev/logs/continuation-check-final.log`, resume-app-analyze.log, resume-app-tests.log, backend-resume-smoke.log and resume-flutter-web.log.

## Remaining limits

This is not complete production data or complete localization. Backend metric names/units and substantial new screen copy remain English; reference-driven metric definitions and country context are broader unfinished architecture. Real social-post embeds and verified speeches were not acquired; development speeches remain labelled. Many officeholders, explanatory texts, statistics and images are development examples, and unavailable performance/funding values remain explicit. Actual Acts text is not loaded. No new root seed files, database reset, publication, commit or branch was made in this continuation.

Earlier browser checks covered directory filtering, IEBC leadership and legal basis, Constitution chapter links, missing content, comparison hierarchy and nearby selection. The resumed chat could not reopen local browser access, so final web comparison formatting is supported by tests/build rather than a second rendered browser check. Phone screenshots do not establish every map gesture, gallery image, geolocation prompt or every screen in both languages/themes; these remain unverified. Follow-ups must preserve that distinction.

## Leadership interaction and web parity follow-up

The owner supplied a Navigator duplicate-page-key assertion after tapping View leader. A regression test reproduced the same assertion and showed two causes: missing explicit keys on custom transition pages, and a tree route outside the shared shell pushing back into that same shell beneath it. All product routes now use a single shell, with typed metadata for self-framed pages, explicit GoRouter page keys and awaited detail-sheet completion before navigation. Repeated leader opens and back navigation have regression coverage.

Mobile level selection is now horizontal at the bottom. The selected scope actually filters nodes and retains only existing edges whose endpoints remain visible; it never fabricates cross-level links. Initial selection uses a populated place scope or first populated reference level. Fit, zoom-in/out and reset/focus controls accompany pan/pinch interaction. Phone screenshots tree-new-bottom.png, tree-new-focused.png and tree-county-filtered.png show the controls and actual filtered graph. The exact node→sheet→View leader action was repeated on Android; tree-view-leader-fixed.png shows the loaded profile with no crash. The updated APK installed successfully (tree-followup-install.log).

Web now exposes leadership in primary navigation, bottom active-level filtering, drag pan, bounded zoom/fit/reset, keyboard controls and node details. Explore and Profile routes provide feature discovery, device preferences and saved-region shortcuts. Responsive mobile-browser navigation has five destinations. Async failures provide stable retry presentation. Eleven web tests, production build and typecheck pass; live /leaders, /explore and /profile return HTTP 200. Browser UI access remains unavailable in this chat, so the newest web layout is not screenshot-verified.

Backend current-active predicates now account for future starts, scheduled future ends, ended tenures, abolished offices, dissolved institutions and inactive/deleted relationships. Exact end dates are exclusive; year-only precision is handled explicitly. Historical leader profiles remain accessible. Twenty-three targeted API tests cover the active-state behavior, including date boundaries. Root quality suite passes (696 Python tests and the API/web suites); Flutter analysis is clean with 26 tests. Flutter web release build also passes. Original data/localisation limitations above still apply; this follow-up does not claim complete production content or complete mobile/web visual parity.
