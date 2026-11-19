/**
 * The process entry point of the product API: creates the Nest application from `AppModule` and listens on `PORT`
 * (default 8700). It belongs to the project, not to Dryv. Settings come from the environment the root runner loads
 * (`DATABASE_URL`, `CORS_ORIGINS` and the authentication settings the auth module documents); nothing is read from
 * files here.
 */
import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";

import { AppModule } from "./app.module.ts";
import { httpLogger } from "./http-logger.ts";
import { PlacePathsInterceptor } from "./server/place-paths.interceptor.ts";

const DEFAULT_PORT = 8700;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(httpLogger());
  app.useGlobalInterceptors(new PlacePathsInterceptor(app.get(DataSource)));
  // Browser apps (the Flutter app on the web) may call the API only from the origins listed here; none by default.
  const origins = (process.env.CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin !== "");
  if (origins.length > 0) app.enableCors({ origin: origins, credentials: true });
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? DEFAULT_PORT));
}

void bootstrap();
