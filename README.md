# nest-template

nestjs@^11 + prisma@^6 + knife4j

## 预置内容

- [x] DTO校验 + i18n 支持
- [x] 返回、报错统一返回信息体
- [x] @nestjs/config
- [x] @nestjs/swagger
- [x] 基于 `passport-jwt` 的校验
- [x] 基础 `auth` 接口模板
- [x] 使用 `ncc` 进行打包

## 使用

```
pnpm i // 安装依赖
pnpm run prisma:generate:dev // 生成 prisma 声明文件（开发时）
pnpm run dev // 开发

pnpm run bundle // 打包成单文件
pnpm run build:docker // 构建镜像
```