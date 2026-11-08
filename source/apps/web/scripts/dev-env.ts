/**
 * Creates local development sign-in keys and prints the environment both processes need.
 *
 *   bun scripts/dev-env.ts          writes ../../../.local/secure/dev-auth/{private,public}.pem if missing
 *
 * The admin site signs tokens for the seeded dev reviewer and admin accounts (`seed dev-accounts` in the
 * database engine); the NestJS API verifies them with the public key. Real OIDC replaces this later by
 * pointing AUTH_ISSUER and AUTH_JWKS_URL at the identity provider. Nothing here works outside localhost.
 */
import { exportPKCS8, exportSPKI, generateKeyPair } from "jose";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const directory = join(new URL(".", import.meta.url).pathname, "..", "..", "..", "..", ".local", "secure", "dev-auth");
const privatePath = join(directory, "private.pem");
const publicPath = join(directory, "public.pem");

if (!existsSync(privatePath)) {
  mkdirSync(directory, { recursive: true });
  const pair = await generateKeyPair("RS256", { extractable: true });
  writeFileSync(privatePath, await exportPKCS8(pair.privateKey), { mode: 0o600 });
  writeFileSync(publicPath, await exportSPKI(pair.publicKey));
  console.log(`created ${directory}`);
}

const publicKey = readFileSync(publicPath, "utf8").trim().replace(/\n/g, "\\n");
console.log(`# API (source/backend/api)
AUTH_ISSUER=https://dev.mzizi.local
AUTH_PUBLIC_KEY="${publicKey}"
# Web (source/apps/web): REVIEW_API_URL defaults to http://127.0.0.1:3000`);
