#!/usr/bin/env bash
# Stop hook for the autonomous rebuild run (.docs/handoffs/HANDOFF-REBUILD-RUN-20261125.md, section 5).
# It does nothing unless .dev/run/active exists. While it exists, a stop is refused as long as any task
# listed there is not completed, unless .dev/run/blocked records a real blocker, or several stop attempts
# in a row made no checklist progress (to avoid an endless loop).
set -u

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
run="${KEEP_GOING_RUN_DIR:-$root/.dev/run}"
max_idle_attempts=5

[ -f "$run/active" ] || exit 0
cd "$root" || exit 0

if [ -s "$run/blocked" ]; then
  echo "$(date -Is) stop allowed: blocker recorded in .dev/run/blocked" >> "$run/log"
  exit 0
fi

next=""
done_total=0
for id in $(grep -oE 'TSK-[A-Z0-9]+' "$run/active"); do
  status=$(task show "$id" --json 2>/dev/null | python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))' 2>/dev/null)
  count=$(task checklist "$id" 2>/dev/null | head -1 | grep -oE '[0-9]+/[0-9]+ done' | cut -d/ -f1)
  done_total=$((done_total + ${count:-0}))
  if [ "$status" != "completed" ] && [ -z "$next" ]; then next="$id"; fi
done

if [ -z "$next" ]; then
  echo "$(date -Is) stop allowed: every listed task is completed" >> "$run/log"
  echo '{"systemMessage":"Rebuild run: every listed task is completed. Remove .dev/run/active and write the closing section of the handoff."}'
  exit 0
fi

last=$(cat "$run/progress" 2>/dev/null || echo -1)
attempts=$(cat "$run/attempts" 2>/dev/null || echo 0)
if [ "$done_total" != "$last" ]; then
  attempts=0
  echo "$done_total" > "$run/progress"
fi
attempts=$((attempts + 1))
echo "$attempts" > "$run/attempts"

if [ "$attempts" -gt "$max_idle_attempts" ]; then
  echo "$(date -Is) stop allowed after $attempts attempts without checklist progress; next task $next" >> "$run/log"
  echo '{"systemMessage":"Rebuild run guard: stop allowed after repeated attempts with no checklist progress. See .dev/run/log."}'
  exit 0
fi

item=$(task checklist "$next" 2>/dev/null | grep -m1 '\[ \]' | sed -E 's/^ *//')
reason="The rebuild run is not finished. Do not stop. Continue with $next, next open item: ${item:-see task checklist $next}. Tick items with task check and record proof with task comment as you go. Re-read section 3 of .docs/handoffs/HANDOFF-REBUILD-RUN-20261125.md if unsure. Put owner questions in .docs/handoffs/REBUILD-OWNER-QUESTIONS.md and keep working. Stop early only for a real blocker written to .dev/run/blocked."
python3 -c 'import json,sys; print(json.dumps({"decision":"block","reason":sys.argv[1]}))' "$reason"
exit 0
