# URL Encode + 本地双向转换设计

日期：2026-09-29

## 背景

工具箱中 base64、大小写、时间戳、IP 等双向转换目前通过 `BConversion` 调用后端 API。这些能力均可在浏览器本地完成。同时需要在侧边栏「base64转换」下方新增「url-encode转换」。

## 目标

1. 新增 url-encode / url-decode 双向工具（纯前端）。
2. 将可本地计算的双向转换改为前端实现，去掉对这些工具的后端依赖。
3. 扩展 `BConversion`，同时支持本地函数与现有 HTTP 模式，避免破坏仍依赖后端的工具。

## 非目标

- 微博 mid-url 前端化（本次保持后端 `/mid_url`）。
- 拼音、短链、域名价值等依赖词库或外部服务的工具改造。
- 删除或下线后端对应 API。
- 引入测试框架。

## 范围

| 工具 | 动作 |
|------|------|
| url-encode（新） | 新增侧边栏项、路由、组件；本地 encode/decode |
| base64 | 改为本地 |
| 大小写 | 改为本地 |
| 时间戳 | 改为本地（东八区） |
| IP ↔ 整数 | 改为本地 |
| mid-url / 拼音 / 短链 / 域名 / 微信 Markdown | 不改 |

## 架构

### BConversion 扩展

保留现有 UI（左右文本框 + encode/decode 按钮）与标签/按钮相关 props。

新增可选 props：

- `forwardFn`：`(input: string) => string`，正向转换（左 → 右）
- `reverseFn`：`(input: string) => string`，反向转换（右 → 左）

行为优先级：

1. 若传入对应本地函数 → 本地执行，写入对侧文本框，不发 HTTP。
2. 否则若存在 `requestUrl` → 保持现有 POST JSON 行为（供 mid-url 等使用）。

错误与空输入：

- 输入为空：`$message.warning('请输入内容')`。
- 转换抛错或校验失败：`$message.error` + 简短原因；不清空另一侧已有内容。

### 工具组件

- 新增 `ToolUrlEncode.vue`：复用 `BConversion`，传入本地 `forwardFn` / `reverseFn`，不传 `requestUrl`。
- 改造 `ToolBase64.vue`、`ToolUpperLower.vue`、`ToolTimeStamp.vue`、`ToolIP.vue`：去掉 `request-url`，改为传入本地转换函数。
- 转换逻辑可放在各组件 `methods`，或抽到 `src/utils/`（按可读性选择；优先小而清晰的工具函数文件）。

### 路由与导航

- 路由：`/url-encode`，name `url-encode`，named view `main` → `ToolUrlEncode`。
- 侧边栏（`App.vue`）：紧挨「base64转换」下方插入「url-encode转换」，`el-icon-document`，`index`/`to` 均为 `/url-encode`。

## 各工具转换规则

| 工具 | 正向 | 反向 | 校验 / 备注 |
|------|------|------|-------------|
| url-encode | `encodeURIComponent` | `decodeURIComponent` | decode 非法序列时提示错误 |
| base64 | UTF-8 安全 encode（避免原生 `btoa` 对非 Latin1 失败） | 对应 decode | 非法 base64 提示错误 |
| 大小写 | `toLowerCase` | `toUpperCase` | 与现有按钮文案一致 |
| 时间戳 | 东八区 `YYYY-MM-DD HH:mm:ss` → Unix 秒 | 秒 → 东八区同格式字符串 | 非法日期 / 非数字提示 |
| IP | IPv4 → 无符号 32 位整数 | 整数 → IPv4 | IP 格式校验；整数范围 `0 ~ 4294967295` |

## 数据流

本地模式：

```
用户点击按钮 → BConversion 取对应侧文本
  → forwardFn / reverseFn(input)
  → 成功则写入对侧；失败则 $message.error
```

HTTP 模式（未改）：

```
用户点击按钮 → POST requestUrl + JSON body → 用响应字段写对侧
```

## 文件变更清单

- `src/components/BConversion.vue` — 支持本地函数
- `src/components/ToolUrlEncode.vue` — 新建
- `src/components/ToolBase64.vue` — 本地化
- `src/components/ToolUpperLower.vue` — 本地化
- `src/components/ToolTimeStamp.vue` — 本地化
- `src/components/ToolIP.vue` — 本地化
- `src/utils/*` — 可选，存放 base64/IP/时间戳等纯函数
- `src/router/index.js` — 注册 `/url-encode`
- `src/App.vue` — 侧边栏插入菜单项

## 成功标准

1. 侧边栏「base64转换」下可见「url-encode转换」，进入后可双向转换。
2. base64、大小写、时间戳、IP 在断网或后端不可用时仍可正常使用。
3. mid-url 等仍走后端的工具行为与改前一致。
4. 空输入与非法输入有明确 Element UI 提示，不静默失败。
