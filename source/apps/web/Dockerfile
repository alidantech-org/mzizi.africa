# The research dashboard and review workbench run on the Bun runtime.
FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3100

CMD ["bun", "run", "start"]
