/**
 * The process entry point of the product API: creates the Nest application from `AppModule` and listens on `PORT`
 * (default 3000). It belongs to the project, not to Dryv. Settings come from the environment the root runner loads
 * (`DATABASE_URL` and the authentication settings the auth module documents); nothing is read from files here.
 */
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.ts";

const DEFAULT_PORT = 3000;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? DEFAULT_PORT));
}

void bootstrap();
