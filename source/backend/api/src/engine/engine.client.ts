/** Authenticated server-to-server transport to the engine's HTTP API. */
import { Injectable } from "@nestjs/common";

@Injectable()
export class EngineClient {
  async request(path: `/${string}`, options: RequestInit = {}): Promise<Response> {
    const address = process.env.ENGINE_URL;
    const key = process.env.ENGINE_SERVICE_TOKEN;
    if (!address || !key) {
      throw new Error("ENGINE_URL and ENGINE_SERVICE_TOKEN are required to call the engine");
    }
    const origin = new URL(address);
    const loopback = ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname);
    if (origin.protocol !== "https:" && !(loopback && origin.protocol === "http:")) {
      throw new Error("ENGINE_URL must use HTTPS outside loopback");
    }
    const url = new URL(path, origin);
    if (url.origin !== origin.origin || url.username || url.password) {
      throw new Error("Engine requests must target the configured origin");
    }
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${key}`);
    return fetch(url, { ...options, headers, redirect: "error" });
  }
}
