FROM oven/bun:1

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY src ./src

RUN bun install

EXPOSE 3000
CMD ["bun", "start"]