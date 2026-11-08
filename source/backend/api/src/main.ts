import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.ts";
import { configFromEnv, createIdentityVerifier, createTokenVerifier, installAuth, installDatabaseAuth, PgAccessAuthority } from "./auth/index.ts";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Contract policies are not wired by the generator; src/auth enforces the exported rules.
  // AUTH_DATABASE_URL selects database authorization (the `auth` schema, clean rewrite); without it the legacy roles-claim guard runs.
  if (process.env.AUTH_DATABASE_URL) installDatabaseAuth(app, createIdentityVerifier(configFromEnv(process.env)), PgAccessAuthority.fromUrl(process.env.AUTH_DATABASE_URL));
  else installAuth(app, createTokenVerifier(configFromEnv(process.env)));
  await app.listen(Number(process.env.PORT ?? 3000));
}

void bootstrap();
