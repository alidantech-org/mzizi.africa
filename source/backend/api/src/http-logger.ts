/**
 * One coloured log line per HTTP request: `GET /v1/reference/values 200 12ms`, with the method, status and
 * duration coloured by what they mean. Colour is off when `NO_COLOR` is set.
 */
import { Logger } from "@nestjs/common";

/** The parts of the Express request and response this logger reads; Express itself is not a direct dependency. */
interface LoggedRequest {
  readonly method: string;
  readonly originalUrl: string;
}
interface LoggedResponse {
  readonly statusCode: number;
  on(event: "finish", listener: () => void): unknown;
}

const on = (code: number, text: string): string => (process.env.NO_COLOR ? text : `\x1b[${code}m${text}\x1b[0m`);

const colourOfStatus = (status: number): number =>
  status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : 32;

const colourOfMethod = (method: string): number => (method === "GET" ? 34 : method === "DELETE" ? 31 : 35);

const SLOW_MS = 500;

export function httpLogger(): (request: LoggedRequest, response: LoggedResponse, next: () => void) => void {
  const logger = new Logger("HTTP");
  return (request, response, next) => {
    const started = process.hrtime.bigint();
    response.on("finish", () => {
      const ms = Number((process.hrtime.bigint() - started) / 1_000_000n);
      const line = [
        on(colourOfMethod(request.method), request.method.padEnd(6)),
        request.originalUrl,
        on(colourOfStatus(response.statusCode), String(response.statusCode)),
        on(ms >= SLOW_MS ? 33 : 90, `${ms}ms`),
      ].join(" ");
      if (response.statusCode >= 500) logger.error(line);
      else if (response.statusCode >= 400) logger.warn(line);
      else logger.log(line);
    });
    next();
  };
}
