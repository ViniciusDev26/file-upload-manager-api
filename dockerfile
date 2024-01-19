FROM oven/bun:1

WORKDIR /app
COPY package.json .
COPY bun.lockb .
COPY prisma prisma

RUN bun install
RUN bun prisma generate
RUN bun prisma migrate deploy

COPY . .

EXPOSE 3000

CMD ["bun", "start"]