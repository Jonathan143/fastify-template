# Fastify Backend Starter (TypeScript)

一个可扩展的 Fastify 后端骨架，包含：

- TypeScript 项目初始化
- 模块化路由
- Schema 参数校验
- 全局错误处理
- CORS
- 请求/错误日志
- 数据库连接（MySQL / MongoDB）
- JWT 鉴权
- 静态资源服务
- 流式处理（文件上传下载 / SSE）

## 1. 安装依赖

```bash
pnpm install
```

## 2. 配置环境变量

```bash
cp .env.example .env
```

至少要配置：

- `JWT_SECRET`
- `DB_TYPE`（`none` / `mysql` / `mongo`）
- 如果使用数据库，补齐 `MYSQL_URI` 或 `MONGO_URI`

## 3. 本地开发

```bash
pnpm dev
```

## 4. 常用脚本

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm build
pnpm start
```

## 5. 主要目录

```text
src/
  config/        # 环境变量加载与校验
  plugins/       # Fastify 插件（cors/jwt/db/error 等）
  routes/        # 按业务拆分路由模块
  db/            # 数据库连接管理
  utils/         # 通用工具
```

## 6. 接口示例

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/users/me`（需要 JWT）
- `POST /api/files/upload`（需要 JWT，multipart）
- `GET /api/files/download/:name`（需要 JWT，流式下载）
- `GET /api/stream/events`（需要 JWT，SSE）

登录成功后把 token 放到请求头：

```text
Authorization: Bearer <token>
```
