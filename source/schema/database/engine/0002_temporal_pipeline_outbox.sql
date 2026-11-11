-- Temporal pipeline identity and dispatch outbox. Existing Python job tables remain during cutover.
ALTER TABLE engine.runs
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS manifest_id text,
  ADD COLUMN IF NOT EXISTS manifest_version integer,
  ADD COLUMN IF NOT EXISTS manifest_hash text,
  ADD COLUMN IF NOT EXISTS request_hash text,
  ADD COLUMN IF NOT EXISTS manifest_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS input jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS runs_idempotency_key_unique
  ON engine.runs(idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE TABLE IF NOT EXISTS engine.pipeline_releases (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  manifest_id text NOT NULL,
  version integer NOT NULL CHECK(version >= 1),
  manifest_hash text NOT NULL CHECK(manifest_hash ~ '^[a-f0-9]{64}$'),
  manifest jsonb NOT NULL,
  status text NOT NULL DEFAULT 'proposed' CHECK(status IN ('proposed','active','superseded')),
  created_by uuid REFERENCES auth.accounts(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  UNIQUE(manifest_id,version)
);
CREATE UNIQUE INDEX IF NOT EXISTS pipeline_one_active_release
  ON engine.pipeline_releases(manifest_id) WHERE status='active';

ALTER TABLE engine.runs DROP CONSTRAINT IF EXISTS runs_status_check;
ALTER TABLE engine.runs ADD CONSTRAINT runs_status_check
  CHECK (status IN ('queued', 'running', 'needs_review', 'succeeded', 'failed', 'cancelled'));

CREATE TABLE IF NOT EXISTS engine.pipeline_commands (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  run_id uuid NOT NULL REFERENCES engine.runs(id) ON DELETE RESTRICT,
  kind text NOT NULL CHECK (kind IN ('start', 'cancel', 'review')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'leased', 'dispatched', 'dead')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at timestamptz NOT NULL DEFAULT now(),
  lease_expires_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  dispatched_at timestamptz
);
CREATE INDEX IF NOT EXISTS pipeline_commands_due
  ON engine.pipeline_commands(available_at, created_at)
  WHERE status IN ('pending', 'leased');
CREATE INDEX IF NOT EXISTS pipeline_commands_run
  ON engine.pipeline_commands(run_id, created_at);

CREATE TABLE IF NOT EXISTS engine.pipeline_reviews (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  run_id uuid NOT NULL REFERENCES engine.runs(id) ON DELETE RESTRICT,
  reviewer_id uuid NOT NULL REFERENCES auth.accounts(id),
  decision text NOT NULL CHECK(decision IN ('approve','reject')),
  rationale text NOT NULL CHECK(length(btrim(rationale)) > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_id)
);
CREATE INDEX IF NOT EXISTS pipeline_reviews_run ON engine.pipeline_reviews(run_id,created_at);

COMMENT ON TABLE engine.pipeline_commands IS
  'Transactional command outbox for starting, cancelling and reviewing durable Temporal workflows.';
COMMENT ON TABLE engine.pipeline_releases IS
  'Immutable safe pipeline definition releases; only one hash-pinned release per manifest may be active.';
