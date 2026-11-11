CREATE SCHEMA audit;

CREATE TYPE audit.decisions_decision_enum AS ENUM ('approve','dispute','reject','request_changes','supersede');
CREATE TYPE audit.decisions_proposed_state_enum AS ENUM ('disputed','rejected','superseded','under_review','unverified','verified');

CREATE TABLE audit.comments (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  actor_id uuid NOT NULL REFERENCES auth.accounts(id) ON DELETE RESTRICT,
  target_id uuid NOT NULL,
  target_kind varchar(100) NOT NULL,
  body text NOT NULL,
  parent_comment_id uuid REFERENCES audit.comments(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK(version >= 1),
  CHECK(length(btrim(body)) > 0)
);
CREATE INDEX comments_target ON audit.comments(target_kind,target_id,created_at);

CREATE TABLE audit.evidence (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  actor_id uuid NOT NULL REFERENCES auth.accounts(id) ON DELETE RESTRICT,
  target_id uuid NOT NULL,
  target_kind varchar(100) NOT NULL,
  file_id uuid NOT NULL,
  note varchar(4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK(version >= 1)
);
CREATE INDEX evidence_target ON audit.evidence(target_kind,target_id,created_at);
CREATE INDEX evidence_file ON audit.evidence(file_id);

CREATE TABLE audit.decisions (
  id uuid PRIMARY KEY DEFAULT uuidv7(),
  reviewer_id uuid NOT NULL REFERENCES auth.accounts(id) ON DELETE RESTRICT,
  target_id uuid NOT NULL,
  target_kind varchar(100) NOT NULL,
  decision audit.decisions_decision_enum NOT NULL,
  proposed_state audit.decisions_proposed_state_enum NOT NULL,
  rationale text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK(version >= 1),
  CHECK(length(btrim(rationale)) > 0)
);
CREATE INDEX decisions_target ON audit.decisions(target_kind,target_id,created_at);

COMMENT ON SCHEMA audit IS 'Append-only comments, evidence links and review decisions. Applying a decision to canonical data is a separate database operation.';
