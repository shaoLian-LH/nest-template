# nest-template

nestjs@^10 + typeorm@^0.3

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
npm i // 安装依赖
npm run dev // 开发

npm run bundle // 打包成单文件
docker build -t nest-template:1.0.0 . // 构建镜像
```