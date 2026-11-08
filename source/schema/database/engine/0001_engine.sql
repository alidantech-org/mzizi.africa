-- PROVISIONAL engine schema (created 2026-11-08 during the package/engine restructuring).
-- NOT FINAL: it is the smallest shape that lets the Python engine keep jobs across restarts, replay events and deliver
-- results reliably. It is subject to review and improvement as features, pipelines and functionality develop; expect
-- columns and tables to change, and the schema to be rebuilt freely in the disposable mzizi_new database.
-- Ownership: written only by the Python engine; read by the NestJS API. The engine never writes domain schemas.

CREATE SCHEMA engine;
COMMENT ON SCHEMA engine IS 'PROVISIONAL, not final. Engine runs, jobs, ordered events and the delivery outbox. Written only by the Python engine.';

CREATE TABLE engine.runs (
  id           uuid PRIMARY KEY DEFAULT uuidv7(),
  name         text NOT NULL CHECK (length(btrim(name)) > 0),
  status       text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'succeeded', 'failed', 'cancelled')),
  requested_by uuid REFERENCES auth.accounts (id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  finished_at  timestamptz
);
COMMENT ON TABLE engine.runs IS 'PROVISIONAL. A workflow execution that groups jobs; requested_by is the account (often a service actor) that started it.';

CREATE TABLE engine.jobs (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  run_id          uuid REFERENCES engine.runs (id),
  kind            text NOT NULL CHECK (length(kind) > 0),
  input           jsonb NOT NULL,
  idempotency_key text UNIQUE,
  status          text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  attempts        integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts    integer NOT NULL DEFAULT 3 CHECK (max_attempts >= 1),
  requested_by    uuid REFERENCES auth.accounts (id),
  result          jsonb,
  error           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  started_at      timestamptz,
  finished_at     timestamptz
);
CREATE INDEX jobs_queue ON engine.jobs (created_at) WHERE status = 'queued';
CREATE INDEX jobs_run ON engine.jobs (run_id) WHERE run_id IS NOT NULL;
COMMENT ON TABLE engine.jobs IS 'PROVISIONAL. One unit of capability work. kind names a registered capability; the idempotency key makes a repeated submit return the same job.';

CREATE TABLE engine.events (
  seq        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  job_id     uuid REFERENCES engine.jobs (id),
  run_id     uuid REFERENCES engine.runs (id),
  kind       text NOT NULL,
  data       jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_job ON engine.events (job_id, seq) WHERE job_id IS NOT NULL;
COMMENT ON TABLE engine.events IS 'PROVISIONAL. Append-only ordered log; seq is the SSE Last-Event-ID so a watcher can replay what it missed.';

CREATE TABLE engine.outbox (
  id              uuid PRIMARY KEY DEFAULT uuidv7(),
  event_seq       bigint NOT NULL REFERENCES engine.events (seq),
  target          text NOT NULL,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'dead')),
  attempts        integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_error      text,
  delivered_at    timestamptz,
  UNIQUE (event_seq, target)
);
CREATE INDEX outbox_due ON engine.outbox (next_attempt_at) WHERE status = 'pending';
COMMENT ON TABLE engine.outbox IS 'PROVISIONAL. Callbacks owed to a target (the NestJS API). Delivered with the event seq as idempotency key and retried with backoff until acknowledged.';
