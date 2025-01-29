FROM node:20-alpine AS builder

# 安装必要的依赖
RUN apk add --no-cache openssl openssl-dev

WORKDIR /usr/src/app

COPY . .


RUN npm install -g pnpm
RUN pnpm install

ENV NODE_ENV=production
RUN pnpm run prisma:generate
RUN pnpm run bundle

# 使用新的阶段来运行应用
FROM node:20-alpine

RUN apk add --no-cache openssl openssl-dev

WORKDIR /usr/src/app

ENV NODE_ENV=production

# 从 builder 阶段复制必要文件
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/.env* .

EXPOSE 3001

# 普通启动命令
CMD ["node", "build/index.js"]
