import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.ts";
import { configFromEnv, createTokenVerifier, installAuth } from "./auth/index.ts";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configuredOrigins = process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const localDevelopmentOrigins =
    process.env.NODE_ENV === "production"
      ? []
      : [/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];
  app.enableCors({
    origin:
      configuredOrigins && configuredOrigins.length > 0
        ? configuredOrigins
        : localDevelopmentOrigins,
  });
  // Contract policies are not wired by the generator; src/auth enforces the exported rules.
  installAuth(app, createTokenVerifier(configFromEnv(process.env)));
  await app.listen(Number(process.env.PORT ?? 3000));
}

void bootstrap();
