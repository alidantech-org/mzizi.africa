import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.ts";
import { configFromEnv, createTokenVerifier, installAuth } from "./auth/index.ts";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Contract policies are not wired by the generator; src/auth enforces the exported rules.
  installAuth(app, createTokenVerifier(configFromEnv(process.env)));
  await app.listen(Number(process.env.PORT ?? 3000));
}

void bootstrap();
