import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

/** Reads one cookie value from the raw Cookie header, without a cookie-parser dependency. */
export const Cookie = createParamDecorator(
  (name: string, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<{ headers: { cookie?: string } }>();
    const header = request.headers.cookie;
    if (!header) return undefined;

    for (const part of header.split(";")) {
      const [key, ...value] = part.trim().split("=");
      if (key === name) return decodeURIComponent(value.join("="));
    }
    return undefined;
  },
);
