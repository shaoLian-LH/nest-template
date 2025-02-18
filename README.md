# nest-template

nestjs@^11 + prisma@^6 + knife4j

## 预置内容

- [x] DTO校验 + i18n 支持
- [x] 返回、报错统一返回信息体
- [x] @nestjs/config
- [x] @nestjs/swagger -> knife4j
- [x] 基于 `passport-jwt` 的校验
- [x] 基础 `auth` 接口模板
- [x] 使用 `ncc` 进行打包

## 使用
1. 启动本地数据库：`docker-compose -f docker-compose.db-example.yaml up -d`
	- 如果需要使用其他数据库或修改了默认端口等配置，请修改 `.env.development` 中的 `DATABASE_URL` 配置
2. 安装依赖：`pnpm i`
3. 生成 prisma 声明文件：`pnpm run prisma:g:dev`
4. 开发：`pnpm run dev`
5. 打包：`pnpm run bundle`
6. 构建镜像：`pnpm run build:docker`