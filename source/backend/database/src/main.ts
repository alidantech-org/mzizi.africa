/** Internal named database operations; application callers never submit SQL or table names. */
import "reflect-metadata";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { Controller, ForbiddenException, Get, HttpException, HttpStatus, Module, Post, Body, Param, Query, UseGuards, Injectable, type CanActivate, type ExecutionContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";

type AuditCommand = { actorId: string; targetId: string; targetKind: string; body?: string; parentCommentId?: string | null; fileId?: string; note?: string | null; decision?: string; proposedState?: string; rationale?: string };

@Injectable()
class ServiceTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const supplied = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>().headers.authorization ?? "";
    const expected = `Bearer ${process.env.DATABASE_SERVICE_TOKEN ?? ""}`;
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    if (!process.env.DATABASE_SERVICE_TOKEN || a.length !== b.length || !timingSafeEqual(a, b)) throw new ForbiddenException();
    return true;
  }
}

@Controller("internal/v1/audit")
@UseGuards(ServiceTokenGuard)
class AuditOperationsController {
  constructor(private readonly db: DataSource) {}

  @Post("comments")
  async createComment(@Body() input: AuditCommand) {
    this.require(input, ["actorId", "targetId", "targetKind", "body"]);
    const [row] = await this.db.query(`INSERT INTO audit.comments(actor_id, target_id, target_kind, body, parent_comment_id, created_at, updated_at, version)
      VALUES ($1,$2,$3,$4,$5,now(),now(),1) RETURNING id, actor_id AS "actorId", target_id AS "targetId", target_kind AS "targetKind", body, parent_comment_id AS "parentCommentId", created_at AS "createdAt", updated_at AS "updatedAt", version`,
    [input.actorId, input.targetId, input.targetKind, input.body, input.parentCommentId ?? null]);
    return { comment: row };
  }

  @Post("evidence")
  async createEvidence(@Body() input: AuditCommand) {
    this.require(input, ["actorId", "targetId", "targetKind", "fileId"]);
    const [row] = await this.db.query(`INSERT INTO audit.evidence(actor_id, target_id, target_kind, file_id, note, created_at, updated_at, version)
      VALUES ($1,$2,$3,$4,$5,now(),now(),1) RETURNING id, actor_id AS "actorId", target_id AS "targetId", target_kind AS "targetKind", file_id AS "fileId", note, created_at AS "createdAt", updated_at AS "updatedAt", version`,
    [input.actorId, input.targetId, input.targetKind, input.fileId, input.note ?? null]);
    return { evidence: row };
  }

  @Post("decisions")
  async createDecision(@Body() input: AuditCommand) {
    this.require(input, ["actorId", "targetId", "targetKind", "decision", "proposedState", "rationale"]);
    const [row] = await this.db.query(`INSERT INTO audit.decisions(reviewer_id, target_id, target_kind, decision, proposed_state, rationale, created_at, updated_at, version)
      VALUES ($1,$2,$3,$4,$5,$6,now(),now(),1) RETURNING id, reviewer_id AS "reviewerId", target_id AS "targetId", target_kind AS "targetKind", decision, proposed_state AS "proposedState", rationale, created_at AS "createdAt", updated_at AS "updatedAt", version`,
    [input.actorId, input.targetId, input.targetKind, input.decision, input.proposedState, input.rationale]);
    return { decision: row };
  }

  private require(input: AuditCommand, keys: (keyof AuditCommand)[]): void {
    for (const key of keys) if (input[key] === undefined || input[key] === null || input[key] === "") throw new HttpException(`${String(key)} is required`, HttpStatus.BAD_REQUEST);
    if (!/^[0-9a-f-]{36}$/i.test(input.actorId) || !/^[0-9a-f-]{36}$/i.test(input.targetId)) throw new HttpException("actorId and targetId must be UUIDs", HttpStatus.BAD_REQUEST);
    if (input.targetKind.length > 100) throw new HttpException("targetKind is too long", HttpStatus.BAD_REQUEST);
  }
}

@Controller("internal/v1/auth")
@UseGuards(ServiceTokenGuard)
class AuthOperationsController {
  constructor(private readonly db: DataSource) {}

  @Post("resolve-identity")
  async resolveIdentity(@Body() input: { issuer: string; subject: string }) {
    if (!input.issuer?.trim() || !input.subject?.trim()) throw new HttpException("issuer and subject are required", HttpStatus.BAD_REQUEST);
    const [row] = await this.db.query("SELECT account_id AS \"accountId\", outcome FROM auth.resolve_identity($1::text, $2::text)", [input.issuer, input.subject]);
    return { accountId: row?.accountId ?? null, outcome: row?.outcome ?? "unknown_identity" };
  }

  @Post("can-platform")
  async canPlatform(@Body() input: { accountId: string; permission: string }) {
    if (!/^[0-9a-f-]{36}$/i.test(input.accountId ?? "") || !/^[a-z][a-z0-9_.-]{1,150}$/i.test(input.permission ?? "")) {
      throw new HttpException("accountId and permission are invalid", HttpStatus.BAD_REQUEST);
    }
    const [row] = await this.db.query("SELECT auth.can_platform($1::uuid, $2::text) AS allowed", [input.accountId, input.permission]);
    return { allowed: Boolean(row?.allowed) };
  }

  @Post("can-link")
  async canLink(@Body() input: { accountId: string; permission: string; table: string; linkId: string | null }) {
    this.validateScope(input);
    const [row] = await this.db.query("SELECT auth.can_link($1::uuid,$2::text,$3::text,$4::uuid) AS decision", [input.accountId, input.permission, input.table, input.linkId]);
    return row?.decision ?? { allowed: false, reason: "unknown" };
  }

  @Post("can-record")
  async canRecord(@Body() input: { accountId: string; permission: string; table: string; recordId: string }) {
    this.validateScope(input);
    if (!/^[0-9a-f-]{36}$/i.test(input.recordId ?? "")) throw new HttpException("recordId must be a UUID", HttpStatus.BAD_REQUEST);
    const [row] = await this.db.query("SELECT auth.can($1::uuid,$2::text,$3::text,$4::uuid) AS decision", [input.accountId, input.permission, input.table, input.recordId]);
    return row?.decision ?? { allowed: false, reason: "unknown" };
  }

  @Post("can-change")
  async canChange(@Body() input: { accountId: string; permission: string; table: string; recordId: string; newLinkId: string | null }) {
    this.validateScope(input);
    if (!/^[0-9a-f-]{36}$/i.test(input.recordId ?? "") || (input.newLinkId !== null && !/^[0-9a-f-]{36}$/i.test(input.newLinkId ?? ""))) throw new HttpException("recordId and newLinkId must be UUIDs", HttpStatus.BAD_REQUEST);
    const [row] = await this.db.query("SELECT auth.can_change($1::uuid,$2::text,$3::text,$4::uuid,$5::uuid) AS decision", [input.accountId, input.permission, input.table, input.recordId, input.newLinkId]);
    return row?.decision ?? { allowed: false, reason: "unknown" };
  }

  private validateScope(input: { accountId: string; permission: string; table: string; linkId?: string | null }): void {
    if (!/^[0-9a-f-]{36}$/i.test(input.accountId ?? "") || !/^[a-z][a-z0-9_.-]{1,150}$/i.test(input.permission ?? "") || !/^[a-z][a-z0-9_]*\.[a-z][a-z0-9_]*$/i.test(input.table ?? "") || (input.linkId !== undefined && input.linkId !== null && !/^[0-9a-f-]{36}$/i.test(input.linkId))) {
      throw new HttpException("authorization scope is invalid", HttpStatus.BAD_REQUEST);
    }
  }
}

type CreateFolderCommand = {
  actorId: string | null;
  parentId: string | null;
  name: string;
  fields: Record<string, unknown>;
};

type LinkRelationCommand = { actorId: string | null; sourceVersionId: string; derivedVersionId: string; relation: string; engineJobId: string | null };

@Controller("internal/v1/filesystem")
@UseGuards(ServiceTokenGuard)
class FilesystemOperationsController {
  constructor(private readonly db: DataSource) {}

  @Post("relations")
  async linkRelation(@Body() input: LinkRelationCommand) {
    const uuid = /^[0-9a-f-]{36}$/i;
    if (!uuid.test(input.sourceVersionId ?? "") || !uuid.test(input.derivedVersionId ?? "") ||
      (input.actorId !== null && !uuid.test(input.actorId ?? "")) || (input.engineJobId !== null && !uuid.test(input.engineJobId ?? "")) ||
      typeof input.relation !== "string" || !/^[a-z][a-z0-9_.-]{0,99}$/.test(input.relation)) {
      throw new HttpException("file relation is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    return this.db.transaction(async (tx) => {
      const [source] = await tx.query("SELECT file_id FROM filesystem.file_versions WHERE id=$1", [input.sourceVersionId]);
      const [derived] = await tx.query("SELECT id FROM filesystem.file_versions WHERE id=$1", [input.derivedVersionId]);
      if (!source || !derived) throw new HttpException("source or derived version was not found", HttpStatus.NOT_FOUND);
      if (input.actorId) {
        const [decision] = await tx.query("SELECT auth.can($1::uuid,'filesystem.read','filesystem.files',$2::uuid) AS decision", [input.actorId, source.file_id]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.read is required for the source file");
      }
      const result = await tx.query(`INSERT INTO filesystem.file_relations(source_version_id,derived_version_id,relation,engine_job_id,created_by)
        VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING id`,
      [input.sourceVersionId, input.derivedVersionId, input.relation, input.engineJobId, input.actorId]);
      return { created: result.length > 0 };
    });
  }

  @Post("uploads")
  async createUpload(@Body() input: { actorId: string | null; folderId: string; filename: string; size: number | null; sha256: string | null; leaseSeconds: number; ttlSeconds: number }) {
    if (!/^[0-9a-f-]{36}$/i.test(input.folderId ?? "") || (input.actorId !== null && !/^[0-9a-f-]{36}$/i.test(input.actorId ?? "")) ||
      typeof input.filename !== "string" || !input.filename || input.filename.length > 255 || input.filename.trim() !== input.filename ||
      input.filename === "." || input.filename === ".." || /[\/\x00-\x1f\x7f]/.test(input.filename) ||
      (input.size !== null && (!Number.isSafeInteger(input.size) || input.size < 0)) ||
      (input.sha256 !== null && !/^[a-f0-9]{64}$/i.test(input.sha256)) ||
      !Number.isInteger(input.leaseSeconds) || input.leaseSeconds < 30 || input.leaseSeconds > 3600 ||
      !Number.isInteger(input.ttlSeconds) || input.ttlSeconds < 60 || input.ttlSeconds > 604800) {
      throw new HttpException("upload reservation is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    const safeName = [...input.filename].map((character) => /[\p{L}\p{N}._-]/u.test(character) ? character : "_").join("").slice(0, 80) || "upload";
    const tempKey = `private/tmp/uploads/${randomUUID().replaceAll("-", "")}/${safeName}`;
    return this.db.transaction(async (tx) => {
      if (input.actorId) {
        const [decision] = await tx.query("SELECT auth.can_link($1::uuid,'filesystem.edit','filesystem.files',$2::uuid) AS decision", [input.actorId, input.folderId]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.edit is required for the destination folder");
      }
      const [upload] = await tx.query(`INSERT INTO filesystem.uploads(folder_id,filename,temp_key,declared_size,declared_sha256,lease_expires_at,expires_at,created_by)
        VALUES($1,$2,$3,$4,$5,now()+make_interval(secs=>$6),now()+make_interval(secs=>$7),$8)
        RETURNING id,temp_key,lease_expires_at,expires_at,status`,
      [input.folderId, input.filename, tempKey, input.size, input.sha256?.toLowerCase() ?? null,
        Math.min(input.leaseSeconds, input.ttlSeconds), input.ttlSeconds, input.actorId]);
      return { upload };
    });
  }

  @Post("uploads/cleanup")
  async cleanupUploads(@Body() input: { actorId: string | null; apply: boolean; batch: number }) {
    if ((input.actorId !== null && !/^[0-9a-f-]{36}$/i.test(input.actorId ?? "")) || typeof input.apply !== "boolean" ||
      !Number.isInteger(input.batch) || input.batch < 1 || input.batch > 500) throw new HttpException("upload cleanup request is invalid", HttpStatus.BAD_REQUEST);
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    if (input.actorId) {
      const [decision] = await this.db.query("SELECT auth.can_platform($1::uuid,'filesystem.delete') AS allowed", [input.actorId]);
      if (!decision?.allowed) throw new ForbiddenException("filesystem.delete is required");
    }
    const candidates = await this.db.transaction((tx) => tx.query(input.apply
      ? "SELECT * FROM filesystem.abandon_expired_uploads($1)"
      : "SELECT * FROM filesystem.expired_uploads($1)", [input.batch]));
    return { candidates };
  }

  @Post("uploads/trim")
  async trimUploads(@Body() input: { actorId: string | null; olderThanDays: number; batch: number }) {
    if ((input.actorId !== null && !/^[0-9a-f-]{36}$/i.test(input.actorId ?? "")) || !Number.isInteger(input.olderThanDays) || input.olderThanDays < 1 || input.olderThanDays > 3650 || !Number.isInteger(input.batch) || input.batch < 1 || input.batch > 5000) {
      throw new HttpException("upload trim request is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    if (input.actorId) {
      const [decision] = await this.db.query("SELECT auth.can_platform($1::uuid,'filesystem.delete') AS allowed", [input.actorId]);
      if (!decision?.allowed) throw new ForbiddenException("filesystem.delete is required");
    }
    const [result] = await this.db.query("SELECT filesystem.trim_upload_sessions($1,$2) AS count", [input.olderThanDays, input.batch]);
    return { trimmed: Number(result?.count ?? 0) };
  }

  @Post("uploads/cleaned")
  async markUploadsCleaned(@Body() input: { actorId: string | null; ids: string[] }) {
    if ((input.actorId !== null && !/^[0-9a-f-]{36}$/i.test(input.actorId ?? "")) || !Array.isArray(input.ids) || input.ids.length > 500 || input.ids.some((id) => !/^[0-9a-f-]{36}$/i.test(id))) {
      throw new HttpException("cleaned upload ids are invalid", HttpStatus.BAD_REQUEST);
    }
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    if (input.actorId) {
      const [decision] = await this.db.query("SELECT auth.can_platform($1::uuid,'filesystem.delete') AS allowed", [input.actorId]);
      if (!decision?.allowed) throw new ForbiddenException("filesystem.delete is required");
    }
    const [result] = await this.db.query("SELECT filesystem.mark_uploads_cleaned($1::uuid[]) AS count", [input.ids]);
    return { marked: Number(result?.count ?? 0) };
  }

  @Get("folders/:folderId")
  async getFolder(@Param("folderId") rawId: string, @Query("actorId") actorId?: string) {
    if (!/^[0-9a-f-]{36}$/i.test(rawId ?? "") || (actorId !== undefined && !/^[0-9a-f-]{36}$/i.test(actorId))) {
      throw new HttpException("folderId or actorId is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    return this.db.transaction(async (tx) => {
      const [folder] = await tx.query("SELECT * FROM filesystem.folders WHERE id=$1", [rawId]);
      if (!folder) throw new HttpException("no such folder", HttpStatus.NOT_FOUND);
      if (actorId) {
        const [decision] = await tx.query("SELECT auth.can($1::uuid,'filesystem.read','filesystem.folders',$2::uuid) AS decision", [actorId, rawId]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.read is required for this folder");
      }
      const [path] = await tx.query("SELECT filesystem.folder_path($1::uuid) AS path", [rawId]);
      const [effective] = await tx.query("SELECT * FROM filesystem.effective_folder($1::uuid)", [rawId]);
      const folders = await tx.query("SELECT id,name FROM filesystem.folders WHERE parent_id=$1 ORDER BY name", [rawId]);
      const files = await tx.query("SELECT id,name,current_version_id FROM filesystem.files WHERE folder_id=$1 ORDER BY name", [rawId]);
      return { folder, path: path?.path ?? null, effective, folders, files };
    });
  }

  @Get("files/:fileId")
  async getFile(@Param("fileId") rawId: string, @Query("actorId") actorId?: string) {
    if (!/^[0-9a-f-]{36}$/i.test(rawId ?? "") || (actorId !== undefined && !/^[0-9a-f-]{36}$/i.test(actorId))) {
      throw new HttpException("fileId or actorId is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    return this.db.transaction(async (tx) => {
      const [file] = await tx.query("SELECT * FROM filesystem.files WHERE id=$1", [rawId]);
      if (!file) throw new HttpException("no such file", HttpStatus.NOT_FOUND);
      if (actorId) {
        const [decision] = await tx.query("SELECT auth.can($1::uuid,'filesystem.read','filesystem.files',$2::uuid) AS decision", [actorId, rawId]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.read is required for this file");
      }
      const [path] = await tx.query("SELECT filesystem.file_path($1::uuid) AS path", [rawId]);
      const versions = await tx.query(`SELECT id,file_id,revision,sha256,size_bytes,extension,content_type,original_filename,provenance,pinned,pin_reason,created_by,created_at
        FROM filesystem.file_versions WHERE file_id=$1 ORDER BY revision`, [rawId]);
      return { file, path: path?.path ?? null, versions };
    });
  }

  @Get("versions/:versionId/download")
  async getDownload(@Param("versionId") rawId: string, @Query("actorId") actorId?: string) {
    if (!/^[0-9a-f-]{36}$/i.test(rawId ?? "") || (actorId !== undefined && !/^[0-9a-f-]{36}$/i.test(actorId))) {
      throw new HttpException("versionId or actorId is invalid", HttpStatus.BAD_REQUEST);
    }
    if (!actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    return this.db.transaction(async (tx) => {
      const [version] = await tx.query("SELECT id,file_id,s3_key FROM filesystem.file_versions WHERE id=$1", [rawId]);
      if (!version) throw new HttpException("no such version", HttpStatus.NOT_FOUND);
      if (actorId) {
        const [decision] = await tx.query("SELECT auth.can($1::uuid,'filesystem.read','filesystem.files',$2::uuid) AS decision", [actorId, version.file_id]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.read is required for this file");
      }
      return { key: version.s3_key };
    });
  }

  @Get("versions/:versionId/lineage")
  async getLineage(@Param("versionId") rawId: string, @Query("actorId") actorId?: string) {
    if (!/^[0-9a-f-]{36}$/i.test(rawId ?? "") || (actorId !== undefined && !/^[0-9a-f-]{36}$/i.test(actorId))) throw new HttpException("versionId or actorId is invalid", HttpStatus.BAD_REQUEST);
    if (!actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    return this.db.transaction(async (tx) => {
      const [version] = await tx.query("SELECT file_id FROM filesystem.file_versions WHERE id=$1", [rawId]);
      if (!version) throw new HttpException("no such version", HttpStatus.NOT_FOUND);
      if (actorId) {
        const [decision] = await tx.query("SELECT auth.can($1::uuid,'filesystem.read','filesystem.files',$2::uuid) AS decision", [actorId, version.file_id]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.read is required for this file");
      }
      const ancestry = await tx.query(`WITH RECURSIVE chain(source_version_id,derived_version_id,relation,engine_job_id,created_at,depth,time_path,id_path) AS (
          SELECT r.source_version_id,r.derived_version_id,r.relation,r.engine_job_id,r.created_at,1,ARRAY[r.created_at],ARRAY[r.id]
          FROM filesystem.file_relations r WHERE r.derived_version_id=$1
          UNION ALL
          SELECT r.source_version_id,r.derived_version_id,r.relation,r.engine_job_id,r.created_at,c.depth+1,c.time_path||r.created_at,c.id_path||r.id
          FROM filesystem.file_relations r JOIN chain c ON r.derived_version_id=c.source_version_id WHERE c.depth<50
        ) SELECT source_version_id AS source,derived_version_id AS derived,relation,engine_job_id FROM chain
        ORDER BY depth,time_path,id_path LIMIT 50`, [rawId]);
      const derived = await tx.query("SELECT derived_version_id AS derived,relation FROM filesystem.file_relations WHERE source_version_id=$1 ORDER BY created_at,id", [rawId]);
      return { ancestry, derived };
    });
  }

  @Post("folders")
  async createFolder(@Body() input: CreateFolderCommand) {
    if (typeof input.name !== "string" || input.name.trim() !== input.name || input.name.length < 1 || input.name.length > 255 || /[\/\x00-\x1f\x7f]/.test(input.name) || input.name === "." || input.name === "..") {
      throw new HttpException("folder name is invalid", HttpStatus.BAD_REQUEST);
    }
    if (input.parentId !== null && !/^[0-9a-f-]{36}$/i.test(input.parentId ?? "")) throw new HttpException("parentId must be a UUID or null", HttpStatus.BAD_REQUEST);
    if (input.actorId !== null && !/^[0-9a-f-]{36}$/i.test(input.actorId ?? "")) throw new HttpException("actorId must be a UUID or null", HttpStatus.BAD_REQUEST);
    if (!input.actorId && process.env.DATABASE_OPERATOR_MODE !== "1") throw new ForbiddenException("an authenticated actor is required");
    const fields = input.fields ?? {};
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) throw new HttpException("fields must be an object", HttpStatus.BAD_REQUEST);
    const allowed = new Set(["access", "access_authorization", "allow_weaker_children", "artifact_role", "is_seed", "acquisition_class", "preparation", "jurisdiction_code", "description", "metadata", "code"]);
    if (Object.keys(fields).some((key) => !allowed.has(key))) throw new HttpException("folder fields contain an unsupported property", HttpStatus.BAD_REQUEST);
    return this.db.transaction(async (tx) => {
      if (input.actorId) {
        const [decision] = await tx.query("SELECT auth.can_link($1::uuid,'filesystem.edit','filesystem.folders',$2::uuid) AS decision", [input.actorId, input.parentId]);
        if (!decision?.decision?.allowed) throw new ForbiddenException("filesystem.edit is required for the parent folder");
        if (fields.access !== undefined && fields.access !== null) {
          const [publish] = await tx.query("SELECT auth.can_link($1::uuid,'filesystem.publish','filesystem.folders',$2::uuid) AS decision", [input.actorId, input.parentId]);
          if (!publish?.decision?.allowed) throw new ForbiddenException("filesystem.publish is required to classify folder access");
        }
      }
      const columns: string[] = ["parent_id", "name", "created_by"];
      const expressions: string[] = ["$1::uuid", "$2::text", "$3::uuid"];
      const values: unknown[] = [input.parentId, input.name, input.actorId];
      for (const [key, value] of Object.entries(fields)) {
        if (value === undefined || value === null) continue;
        columns.push(key);
        values.push(value);
        expressions.push(key === "metadata" || key === "access_authorization" ? `$${values.length}::jsonb` : `$${values.length}`);
      }
      const [folder] = await tx.query(`INSERT INTO filesystem.folders (${columns.join(",")}) VALUES (${expressions.join(",")}) RETURNING *`, values);
      await tx.query("SET CONSTRAINTS ALL IMMEDIATE");
      await tx.query("SET CONSTRAINTS ALL DEFERRED");
      const [path] = await tx.query("SELECT filesystem.folder_path($1::uuid) AS path", [folder.id]);
      return { folder, path: path?.path ?? null };
    });
  }
}

@Controller("internal/v1/engine")
@UseGuards(ServiceTokenGuard)
class EngineOperationsController {
  constructor(private readonly db: DataSource) {}

  @Post("runs")
  async createRun(@Body() body: { name: string; requestedBy: string | null }) {
    if (!body.name?.trim() || body.name.length > 255 || (body.requestedBy !== null && !/^[0-9a-f-]{36}$/i.test(body.requestedBy ?? ""))) {
      throw new HttpException("run name or requestedBy is invalid", HttpStatus.BAD_REQUEST);
    }
    const [run] = await this.db.query("INSERT INTO engine.runs(name,requested_by) VALUES($1,$2) RETURNING *", [body.name, body.requestedBy]);
    return { run };
  }

  @Get("runs/:runId")
  async getRun(@Param("runId") runId: string) {
    const [run] = await this.db.query("SELECT * FROM engine.runs WHERE id=$1", [this.uuid(runId)]);
    return { run: run ?? null };
  }

  @Post("jobs")
  async createJob(@Body() body: { kind: string; input: Record<string, unknown>; idempotencyKey: string | null; requestedBy: string | null; runId: string | null; maxAttempts: number }) {
    if (!/^[a-z][a-z0-9_.-]{1,120}$/i.test(body.kind ?? "") || !body.input || typeof body.input !== "object" || Array.isArray(body.input) ||
      (body.idempotencyKey !== null && (typeof body.idempotencyKey !== "string" || body.idempotencyKey.length > 200)) ||
      (body.requestedBy !== null && !/^[0-9a-f-]{36}$/i.test(body.requestedBy ?? "")) ||
      (body.runId !== null && !/^[0-9a-f-]{36}$/i.test(body.runId ?? "")) || !Number.isInteger(body.maxAttempts) || body.maxAttempts < 1 || body.maxAttempts > 10) {
      throw new HttpException("job request is invalid", HttpStatus.BAD_REQUEST);
    }
    return this.db.transaction(async (tx) => {
      const [created] = await tx.query(`INSERT INTO engine.jobs(kind,input,idempotency_key,requested_by,run_id,max_attempts)
        VALUES($1,$2::jsonb,$3,$4,$5,$6) ON CONFLICT(idempotency_key) DO NOTHING RETURNING *`,
      [body.kind, JSON.stringify(body.input), body.idempotencyKey, body.requestedBy, body.runId, body.maxAttempts]);
      if (created) return { job: created, created: true };
      const [existing] = await tx.query("SELECT * FROM engine.jobs WHERE idempotency_key=$1", [body.idempotencyKey]);
      if (!existing) throw new HttpException("job was not created", HttpStatus.CONFLICT);
      if (existing.kind !== body.kind || stableJson(existing.input) !== stableJson(body.input) || existing.requested_by !== body.requestedBy || existing.run_id !== body.runId) {
        throw new HttpException("idempotency key was already used for a different job request", HttpStatus.CONFLICT);
      }
      return { job: existing, created: false };
    });
  }

  @Get("jobs")
  async listJobs(@Query("status") status?: string, @Query("limit") rawLimit = "100") {
    if (status && !["queued", "running", "succeeded", "failed", "cancelled"].includes(status)) throw new HttpException("job status is invalid", HttpStatus.BAD_REQUEST);
    const limit = Number(rawLimit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 500) throw new HttpException("job limit is invalid", HttpStatus.BAD_REQUEST);
    return { jobs: await this.db.query("SELECT * FROM engine.jobs WHERE ($1::text IS NULL OR status=$1) ORDER BY created_at DESC LIMIT $2", [status ?? null, limit]) };
  }

  @Get("jobs/:jobId")
  async getJob(@Param("jobId") jobId: string) {
    const [job] = await this.db.query("SELECT * FROM engine.jobs WHERE id=$1", [this.uuid(jobId)]);
    return { job: job ?? null };
  }

  @Post("jobs/:jobId/update")
  async updateJob(@Param("jobId") jobId: string, @Body() body: Record<string, unknown>) {
    const id = this.uuid(jobId);
    const allowed = new Set(["status", "attempts", "result", "error", "started_at", "finished_at"]);
    if (!Object.keys(body).length || Object.keys(body).some((key) => !allowed.has(key))) throw new HttpException("job update contains unsupported fields", HttpStatus.BAD_REQUEST);
    if (body.status !== undefined && !["queued", "running", "succeeded", "failed", "cancelled"].includes(String(body.status))) throw new HttpException("job status is invalid", HttpStatus.BAD_REQUEST);
    const columns = Object.keys(body);
    const params = columns.map((key) => key === "result" && body[key] !== null ? JSON.stringify(body[key]) : body[key]);
    const sets = columns.map((key, index) => `${key}=$${index + 2}${key === "result" ? "::jsonb" : ""}`);
    const [job] = await this.db.query(`UPDATE engine.jobs SET ${sets.join(",")} WHERE id=$1 RETURNING *`, [id, ...params]);
    if (!job) throw new HttpException("job was not found", HttpStatus.NOT_FOUND);
    return { job };
  }

  @Post("jobs/requeue-interrupted")
  async requeueInterrupted() {
    const result = await this.db.query("UPDATE engine.jobs SET status='queued' WHERE status='running' RETURNING id");
    return { count: result.length };
  }

  @Get("jobs-queued")
  async queuedJobs() { return { jobs: await this.db.query("SELECT * FROM engine.jobs WHERE status='queued' ORDER BY created_at") }; }

  @Post("events")
  async addEvent(@Body() body: { kind: string; jobId: string | null; runId: string | null; data: Record<string, unknown>; targets: string[] }) {
    if (!/^[a-z][a-z0-9_.-]{1,120}$/i.test(body.kind ?? "") || !body.data || typeof body.data !== "object" || Array.isArray(body.data) || !Array.isArray(body.targets) ||
      body.targets.some((target) => typeof target !== "string" || target.length > 500)) throw new HttpException("event is invalid", HttpStatus.BAD_REQUEST);
    const jobId = body.jobId === null ? null : this.uuid(body.jobId);
    const runId = body.runId === null ? null : this.uuid(body.runId);
    return this.db.transaction(async (tx) => {
      const [event] = await tx.query(`INSERT INTO engine.events(job_id,run_id,kind,data) VALUES($1,$2,$3,$4::jsonb) RETURNING *`,
        [jobId, runId, body.kind, JSON.stringify(body.data)]);
      for (const target of body.targets) await tx.query("INSERT INTO engine.outbox(event_seq,target) VALUES($1,$2) ON CONFLICT DO NOTHING", [event.seq, target]);
      return { event };
    });
  }

  @Get("events")
  async events(@Query("after") after = "0", @Query("jobId") jobId?: string, @Query("limit") rawLimit = "500") {
    const seq = Number(after), limit = Number(rawLimit);
    if (!Number.isSafeInteger(seq) || seq < 0 || !Number.isInteger(limit) || limit < 1 || limit > 500) throw new HttpException("event cursor or limit is invalid", HttpStatus.BAD_REQUEST);
    return { events: await this.db.query("SELECT * FROM engine.events WHERE seq>$1 AND ($2::uuid IS NULL OR job_id=$2) ORDER BY seq LIMIT $3", [seq, jobId ? this.uuid(jobId) : null, limit]) };
  }

  @Get("outbox/due")
  async dueOutbox(@Query("limit") rawLimit = "20") {
    const limit = Number(rawLimit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new HttpException("outbox limit is invalid", HttpStatus.BAD_REQUEST);
    return { entries: await this.db.query(`SELECT o.id,o.event_seq AS "eventSeq",o.target,o.attempts,e.kind,e.job_id AS "jobId",e.run_id AS "runId",e.data,e.created_at AS "createdAt"
      FROM engine.outbox o JOIN engine.events e ON e.seq=o.event_seq WHERE o.status='pending' AND o.next_attempt_at<=now() ORDER BY o.event_seq LIMIT $1`, [limit]) };
  }

  @Post("outbox/:id/delivered")
  async markOutboxDelivered(@Param("id") rawId: string) {
    const [entry] = await this.db.query("UPDATE engine.outbox SET status='delivered',delivered_at=now() WHERE id=$1 RETURNING id", [this.uuid(rawId)]);
    return { delivered: Boolean(entry) };
  }

  @Post("outbox/:id/failed")
  async markOutboxFailed(@Param("id") rawId: string, @Body() body: { error: string; retryIn: number; maxAttempts: number }) {
    if (!Number.isFinite(body.retryIn) || !Number.isInteger(body.maxAttempts)) throw new HttpException("outbox retry policy is invalid", HttpStatus.BAD_REQUEST);
    const retryIn = Math.max(0, Math.min(3600, Number(body.retryIn)));
    const maxAttempts = Math.max(1, Math.min(20, Math.trunc(body.maxAttempts)));
    const [entry] = await this.db.query(`UPDATE engine.outbox SET attempts=attempts+1,last_error=$2,
      status=CASE WHEN attempts+1 >= $3 THEN 'dead' ELSE 'pending' END,next_attempt_at=now()+make_interval(secs=>$4)
      WHERE id=$1 RETURNING status`, [this.uuid(rawId), String(body.error ?? "delivery failed").slice(0,1000), maxAttempts, retryIn]);
    return { status: entry?.status ?? "missing" };
  }

  private uuid(value: string): string {
    if (!/^[0-9a-f-]{36}$/i.test(value ?? "")) throw new HttpException("identifier must be a UUID", HttpStatus.BAD_REQUEST);
    return value;
  }
}

type StartRunCommand = {
  idempotencyKey: string;
  manifestId: string;
  manifestVersion: number;
  manifestHash: string;
  input: Record<string, unknown>;
  requestedBy: string;
};

@Controller("internal/v1/pipelines")
@UseGuards(ServiceTokenGuard)
class PipelineOperationsController {
  constructor(private readonly db: DataSource) {}

  @Post("releases")
  async proposeRelease(@Body() body: { manifest: Record<string, unknown>; createdBy: string }) {
    const manifest = body.manifest;
    this.validateManifest(manifest);
    if (!/^[0-9a-f-]{36}$/i.test(body.createdBy ?? "")) throw new HttpException("createdBy must be a UUID", HttpStatus.BAD_REQUEST);
    const encoded = stableJson(manifest);
    const hash = createHash("sha256").update(encoded).digest("hex");
    const [created] = await this.db.query(`INSERT INTO engine.pipeline_releases(manifest_id,version,manifest_hash,manifest,created_by)
      VALUES($1,$2,$3,$4::jsonb,$5) ON CONFLICT(manifest_id,version) DO NOTHING
      RETURNING id,manifest_id AS "manifestId",version,manifest_hash AS "manifestHash",status,created_at AS "createdAt"`,
      [manifest.id, manifest.version, hash, encoded, body.createdBy]);
    if (created) return { release: created, created: true };
    const [existing] = await this.db.query(`SELECT id,manifest_id AS "manifestId",version,manifest_hash AS "manifestHash",status,created_at AS "createdAt"
      FROM engine.pipeline_releases WHERE manifest_id=$1 AND version=$2`, [manifest.id, manifest.version]);
    if (!existing || existing.manifestHash !== hash) throw new HttpException("manifest version already exists with different content", HttpStatus.CONFLICT);
    return { release: existing, created: false };
  }

  @Post("releases/:releaseId/activate")
  async activateRelease(@Param("releaseId") releaseId: string, @Body() body: { expectedHash: string }) {
    if (!/^[0-9a-f-]{36}$/i.test(releaseId) || !/^[a-f0-9]{64}$/i.test(body.expectedHash ?? "")) {
      throw new HttpException("releaseId and expectedHash are required", HttpStatus.BAD_REQUEST);
    }
    return this.db.transaction(async (tx) => {
      const [release] = await tx.query("SELECT id,manifest_id AS \"manifestId\",manifest_hash AS \"manifestHash\",status FROM engine.pipeline_releases WHERE id=$1 FOR UPDATE", [releaseId]);
      if (!release) throw new HttpException("release was not found", HttpStatus.NOT_FOUND);
      if (release.manifestHash !== body.expectedHash) throw new HttpException("release changed since it was reviewed", HttpStatus.CONFLICT);
      if (release.status === "active") return { activated: true, id: release.id, manifestHash: release.manifestHash };
      if (release.status !== "proposed") throw new HttpException("only a proposed release can be activated", HttpStatus.CONFLICT);
      await tx.query("UPDATE engine.pipeline_releases SET status='superseded' WHERE manifest_id=$1 AND status='active'", [release.manifestId]);
      await tx.query("UPDATE engine.pipeline_releases SET status='active',activated_at=now() WHERE id=$1", [releaseId]);
      return { activated: true, id: release.id, manifestHash: release.manifestHash };
    });
  }

  @Post("runs")
  async startRun(@Body() command: StartRunCommand) {
    this.validateStart(command);
    return this.db.transaction(async (tx) => {
      const [release] = await tx.query(`SELECT manifest FROM engine.pipeline_releases
        WHERE manifest_id=$1 AND version=$2 AND manifest_hash=$3 AND status='active' FOR SHARE`,
        [command.manifestId, command.manifestVersion, command.manifestHash]);
      if (!release) throw new HttpException("the requested manifest release is not active", HttpStatus.CONFLICT);
      const [created] = await tx.query(`INSERT INTO engine.runs
        (name,status,requested_by,idempotency_key,manifest_id,manifest_version,manifest_hash,request_hash,manifest_snapshot,input)
        VALUES ($1,'queued',$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb)
        ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING
        RETURNING id`, [command.manifestId, command.requestedBy, command.idempotencyKey, command.manifestId,
        command.manifestVersion, command.manifestHash, createHash("sha256").update(stableJson({ manifestHash: command.manifestHash, requestedBy: command.requestedBy, input: command.input })).digest("hex"),
        JSON.stringify(release.manifest), JSON.stringify(command.input)]);
      if (created?.id) {
        await tx.query(`INSERT INTO engine.pipeline_commands(run_id,kind,payload) VALUES($1,'start',$2::jsonb)`,
          [created.id, JSON.stringify({ requestedBy: command.requestedBy })]);
        return { runId: created.id, created: true };
      }
      const [existing] = await tx.query(`SELECT id AS "runId", request_hash AS "requestHash" FROM engine.runs WHERE idempotency_key=$1`, [command.idempotencyKey]);
      if (!existing) throw new HttpException("run creation conflict; retry the request", HttpStatus.CONFLICT);
      const requestHash = createHash("sha256").update(stableJson({ manifestHash: command.manifestHash, requestedBy: command.requestedBy, input: command.input })).digest("hex");
      if (existing.requestHash !== requestHash) throw new HttpException("idempotency key was already used for different inputs", HttpStatus.CONFLICT);
      return { runId: existing.runId, created: false };
    });
  }

  @Get("runs/:runId")
  async getRun(@Param("runId") runId: string) {
    if (!/^[0-9a-f-]{36}$/i.test(runId)) throw new HttpException("runId must be a UUID", HttpStatus.BAD_REQUEST);
    const [run] = await this.db.query(`SELECT id AS "runId", name, status, requested_by AS "requestedBy",
      manifest_id AS "manifestId", manifest_version AS "manifestVersion", manifest_hash AS "manifestHash",
      input, created_at AS "createdAt", finished_at AS "finishedAt" FROM engine.runs WHERE id=$1`, [runId]);
    if (!run) throw new HttpException("run was not found", HttpStatus.NOT_FOUND);
    return run;
  }

  @Post("runs/:runId/cancel")
  async cancelRun(@Param("runId") runId: string, @Body() body: { requestedBy: string }) {
    if (!/^[0-9a-f-]{36}$/i.test(runId) || !/^[0-9a-f-]{36}$/i.test(body.requestedBy ?? "")) {
      throw new HttpException("runId and requestedBy must be UUIDs", HttpStatus.BAD_REQUEST);
    }
    return this.db.transaction(async (tx) => {
      const [run] = await tx.query("SELECT status FROM engine.runs WHERE id=$1 FOR UPDATE", [runId]);
      if (!run) throw new HttpException("run was not found", HttpStatus.NOT_FOUND);
      if (["succeeded", "failed", "cancelled"].includes(run.status)) return { runId, status: run.status, accepted: false };
      await tx.query("INSERT INTO engine.pipeline_commands(run_id,kind,payload) VALUES($1,'cancel',$2::jsonb)",
        [runId, JSON.stringify({ requestedBy: body.requestedBy })]);
      return { runId, status: run.status, accepted: true };
    });
  }

  @Post("runs/:runId/review")
  async reviewRun(@Param("runId") runId: string, @Body() body: { reviewerId: string; decision: "approve" | "reject"; rationale: string }) {
    if (!/^[0-9a-f-]{36}$/i.test(runId) || !/^[0-9a-f-]{36}$/i.test(body.reviewerId ?? "") ||
      !["approve", "reject"].includes(body.decision) || !body.rationale?.trim()) {
      throw new HttpException("review decision is invalid", HttpStatus.BAD_REQUEST);
    }
    return this.db.transaction(async (tx) => {
      const [run] = await tx.query("SELECT status FROM engine.runs WHERE id=$1 FOR UPDATE", [runId]);
      if (!run) throw new HttpException("run was not found", HttpStatus.NOT_FOUND);
      if (run.status !== "needs_review") throw new HttpException("run is not waiting for review", HttpStatus.CONFLICT);
      const [prior] = await tx.query("SELECT id FROM engine.pipeline_reviews WHERE run_id=$1", [runId]);
      if (prior) throw new HttpException("run already has a review decision", HttpStatus.CONFLICT);
      await tx.query(`INSERT INTO engine.pipeline_reviews(run_id,reviewer_id,decision,rationale)
        VALUES($1,$2,$3,$4)`, [runId, body.reviewerId, body.decision, body.rationale]);
      await tx.query(`INSERT INTO engine.pipeline_commands(run_id,kind,payload)
        VALUES($1,'review',$2::jsonb)`, [runId, JSON.stringify({ decision: body.decision, reviewerId: body.reviewerId })]);
      return { runId, accepted: true };
    });
  }

  @Post("commands/claim")
  async claimCommand(@Body() body: { leaseSeconds?: number }) {
    const leaseSeconds = Math.max(10, Math.min(120, Math.trunc(body.leaseSeconds ?? 30)));
    return this.db.transaction(async (tx) => {
      const [command] = await tx.query(`SELECT id FROM engine.pipeline_commands
        WHERE (status='pending' AND available_at <= now()) OR (status='leased' AND lease_expires_at < now())
        ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1`);
      if (!command) return { command: null };
      const [leased] = await tx.query(`UPDATE engine.pipeline_commands SET status='leased', attempts=attempts+1,
        lease_expires_at=now()+($2::text || ' seconds')::interval WHERE id=$1
        RETURNING id, run_id AS "runId", kind, payload, attempts`, [command.id, leaseSeconds]);
      return { command: leased ?? null };
    });
  }

  @Post("commands/:commandId/dispatched")
  async dispatched(@Param("commandId") commandId: string) {
    const [row] = await this.db.query(`UPDATE engine.pipeline_commands SET status='dispatched', dispatched_at=now(),
      lease_expires_at=NULL WHERE id=$1 AND status='leased' RETURNING id`, [commandId]);
    return { dispatched: Boolean(row) };
  }

  @Post("commands/:commandId/retry")
  async retry(@Param("commandId") commandId: string, @Body() body: { error: string }) {
    const error = String(body.error ?? "dispatch failed").slice(0, 1000);
    const [row] = await this.db.query(`UPDATE engine.pipeline_commands SET
      status=CASE WHEN attempts >= 12 THEN 'dead' ELSE 'pending' END,
      available_at=now()+LEAST(300, power(2, LEAST(attempts,8))) * interval '1 second',
      lease_expires_at=NULL,last_error=$2 WHERE id=$1 AND status='leased' RETURNING status`, [commandId, error]);
    return { status: row?.status ?? "missing" };
  }

  @Post("runs/:runId/progress")
  async progress(@Param("runId") runId: string, @Body() body: { kind: string; status?: string; data?: Record<string, unknown> }) {
    const statuses = new Set(["queued", "running", "needs_review", "succeeded", "failed", "cancelled"]);
    if (!/^[0-9a-f-]{36}$/i.test(runId) || !/^[a-z][a-z0-9._-]{1,99}$/.test(body.kind ?? "")) {
      throw new HttpException("runId or event kind is invalid", HttpStatus.BAD_REQUEST);
    }
    if (body.status && !statuses.has(body.status)) throw new HttpException("run status is invalid", HttpStatus.BAD_REQUEST);
    return this.db.transaction(async (tx) => {
      const [run] = await tx.query("SELECT id FROM engine.runs WHERE id=$1 FOR UPDATE", [runId]);
      if (!run) throw new HttpException("run was not found", HttpStatus.NOT_FOUND);
      if (body.status) await tx.query("UPDATE engine.runs SET status=$2, finished_at=CASE WHEN $2 IN ('succeeded','failed','cancelled') THEN now() ELSE NULL END WHERE id=$1", [runId, body.status]);
      const [event] = await tx.query(`INSERT INTO engine.events(run_id,kind,data) VALUES($1,$2,$3::jsonb)
        RETURNING seq,kind,data,created_at AS "createdAt"`, [runId, body.kind, JSON.stringify(body.data ?? {})]);
      return { event };
    });
  }

  @Get("runs/:runId/events")
  async events(@Param("runId") runId: string, @Query("after") after = "0") {
    const sequence = Number(after);
    if (!/^[0-9a-f-]{36}$/i.test(runId) || !Number.isSafeInteger(sequence) || sequence < 0) throw new HttpException("runId or event cursor is invalid", HttpStatus.BAD_REQUEST);
    const events = await this.db.query(`SELECT seq,kind,data,created_at AS "createdAt" FROM engine.events
      WHERE run_id=$1 AND seq>$2 ORDER BY seq LIMIT 500`, [runId, sequence]);
    return { events };
  }

  private validateStart(command: StartRunCommand): void {
    if (!/^[a-z][a-z0-9._-]{1,99}$/.test(command.manifestId ?? "") || !Number.isInteger(command.manifestVersion) || command.manifestVersion < 1 ||
      !/^[a-f0-9]{64}$/i.test(command.manifestHash ?? "") || !/^[a-zA-Z0-9._:-]{8,200}$/.test(command.idempotencyKey ?? "") ||
      !/^[0-9a-f-]{36}$/i.test(command.requestedBy ?? "") || !command.input || typeof command.input !== "object") {
      throw new HttpException("run command is invalid", HttpStatus.BAD_REQUEST);
    }
  }

  private validateManifest(manifest: Record<string, unknown>): asserts manifest is Record<string, any> {
    const allowed = new Set(["extraction.pdf", "extraction.csv", "extraction.json", "extraction.geojson", "scraping.links", "manifest.validate_structure", "manifest.check_seeds"]);
    if (!manifest || manifest.schema_version !== "pipeline/v1" || !/^[a-z][a-z0-9._-]{1,99}$/.test(String(manifest.id ?? "")) ||
      !Number.isInteger(manifest.version) || Number(manifest.version) < 1 || !Array.isArray(manifest.steps) || manifest.steps.length < 1 || manifest.steps.length > 100 ||
      Object.keys(manifest).some((key) => !["schema_version", "id", "version", "steps"].includes(key))) {
      throw new HttpException("manifest header or steps are invalid", HttpStatus.BAD_REQUEST);
    }
    const ids = new Set<string>();
    for (const step of manifest.steps) {
      if (!step || typeof step !== "object" || !/^[a-z][a-z0-9_-]{0,63}$/.test(String(step.id ?? "")) || ids.has(step.id) || !allowed.has(step.capability) ||
        !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(String(step.capability_version ?? "")) || !step.input || typeof step.input !== "object" || Array.isArray(step.input)) {
        throw new HttpException("manifest contains an invalid or unregistered step", HttpStatus.BAD_REQUEST);
      }
      const supported = new Set(["id", "capability", "capability_version", "input", "depends_on", "timeout_seconds", "max_attempts", "review_gate"]);
      if (Object.keys(step).some((key) => !supported.has(key))) throw new HttpException("manifest step contains unsupported fields", HttpStatus.BAD_REQUEST);
      if ((step.timeout_seconds !== undefined && (!Number.isInteger(step.timeout_seconds) || step.timeout_seconds < 1 || step.timeout_seconds > 86400)) ||
        (step.max_attempts !== undefined && (!Number.isInteger(step.max_attempts) || step.max_attempts < 1 || step.max_attempts > 10)) ||
        (step.review_gate !== undefined && typeof step.review_gate !== "boolean") ||
        (step.depends_on !== undefined && (!Array.isArray(step.depends_on) || step.depends_on.length > 20 || new Set(step.depends_on).size !== step.depends_on.length))) {
        throw new HttpException("manifest step policy is outside supported bounds", HttpStatus.BAD_REQUEST);
      }
      for (const dependency of step.depends_on ?? []) if (!ids.has(dependency)) throw new HttpException("steps must depend only on earlier steps", HttpStatus.BAD_REQUEST);
      ids.add(step.id);
    }
  }
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function localDatabaseUrl(): string {
  const value = process.env.DATABASE_RUNTIME_URL ?? "postgres://database_runtime@localhost:5432/mzizi_new";
  const url = new URL(value);
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (!["localhost", "127.0.0.1", "::1", "postgis"].includes(host) || url.pathname.slice(1) !== "mzizi_new") {
    throw new Error("The local database service may connect only to the local mzizi_new database");
  }
  return value;
}

@Module({ controllers: [AuditOperationsController, AuthOperationsController, EngineOperationsController, FilesystemOperationsController, PipelineOperationsController], providers: [ServiceTokenGuard, { provide: DataSource, useFactory: async () => {
  const url = localDatabaseUrl();
  const source = new DataSource({ type: "postgres", url, entities: [], synchronize: false, migrationsRun: false });
  return source.initialize();
} }] })
class DatabaseApp {}

const app = await NestFactory.create(DatabaseApp);
await app.listen(Number(process.env.DATABASE_PORT ?? 3301), "127.0.0.1");
