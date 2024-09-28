FROM oven/bun AS base

COPY . .

RUN bun install

EXPOSE 5000

CMD [ "bun", "start" ]
