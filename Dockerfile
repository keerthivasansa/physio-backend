FROM oven:oven/bun AS base

COPY . .

RUN bun install --frozen-lockfile

EXPOSE 5000

CMD [ "bun", "index.ts" ]