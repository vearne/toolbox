# 萌叔的工具箱 UI 重设计（晴空工区）

日期：2026-09-30  
状态：已确认，待实现计划

## 背景

当前站点为 Vue 2 + Element UI 的个人工具箱「萌叔的工具箱」。现有界面使用青蓝渐变顶栏/底栏、粉青糖果渐变背景与白卡片侧栏，观感偏模板、留白偏松、信息层级偏平。用户希望整体换一套 UI，但不改业务逻辑。

## 目标与成功标准

- 整站外壳（顶栏 / 侧栏 / 主区 / 底栏）呈现统一的「晴空工区」气质
- 共用转换组件视觉与外壳一致，操作流不变
- 通过 CSS 变量集中管理主题，后续改色只需改 token
- 桌面侧栏常驻；窄屏可折叠侧栏
- 不引入暗色模式、紫色主题、重发光效果

## 非目标

- 不重做微信 Markdown（`ToolWeChatMarkdown` / `StyleConfigPanel` / `HeadingConfig`）内页
- 不重做域名等非共用转换页的内部布局（仅享受新外壳）
- 不改路由、菜单文案/顺序、工具业务逻辑与 API
- 不升级 Vue / Element UI 大版本
- 不新增功能（搜索、收藏、暗色模式等）

## 已确认决策

| 项 | 选择 |
|---|---|
| 视觉气质 | C · 晴空工区（Clear Desk） |
| 布局 | Layout 1 · 左侧文字侧栏 |
| 改造范围 | B · 外壳 + 通用转换页 |
| 实现路径 | 方案 2 · 抽取 Design Tokens + 改样式 |

曾对比未选：A 石墨工具台、B 墨绿工房；Layout 2 顶部标签、Layout 3 图标轨；方案 1 仅改样式、方案 3 重做布局 DOM。

## 视觉系统（Design Tokens）

新增 `src/styles/theme.css`，在 `src/main.js` 引入。字体通过该文件 `@import` Google Fonts（`DM Sans`），并提供系统字体栈兜底。

Token 色值实现时可微调 ± 几档，但必须保持下表方向：

| Token | 用途 | 方向 |
|---|---|---|
| `--bg-gradient` | 页面背景 | 浅雾蓝纵向渐变（上略深、下更浅） |
| `--surface` | 侧栏/主区面板 | 半透明白 |
| `--surface-border` | 面板边框 | 浅白/浅灰蓝 |
| `--surface-shadow` | 面板阴影 | 轻阴影 |
| `--color-primary` | 激活态、主按钮 | 约 `#0b6bcb` |
| `--color-secondary-bg` | 次按钮背景 | 浅灰蓝 |
| `--color-text` | 主文字 | 近墨蓝灰 |
| `--color-text-muted` | 次要文字 | 中灰 |
| `--radius-panel` | 面板圆角 | 约 16px |
| `--radius-control` | 输入/按钮圆角 | 约 10–12px |
| `--space-*` | 外边距/内边距 | 侧栏与主区外边距统一；主区内边距约 24–30px |
| `--font-ui` | UI/标题字体 | `DM Sans`，系统字体兜底 |

全局去掉现有青蓝/粉青糖果渐变硬编码色。

## 布局与外壳

保留骨架：`el-header` + `el-aside`（文字菜单）+ `el-main` + `el-footer`。

### 顶栏（`TheHeader.vue` + `App.vue` 中 header 样式）

- 融入雾蓝背景，底部分割线，无高强度渐变条
- 左：logo +「萌叔的工具箱」；右：「在线实用工具集」
- 品牌字用 `--font-ui`，字重偏重、略收紧字距

### 侧栏（`App.vue` 菜单）

- 半透明白面板 + 圆角 + 轻阴影
- 菜单项为圆角块；激活：白底 + 主色字 + 轻阴影
- 取消渐变整条高亮
- 菜单项与路由不变

### 主区

- 同表面 token；保留合理 `min-height`；内边距用 token

### 底栏（`TheFooter.vue`）

- 弱化：浅色/融入背景；版权与链接用次要文字色
- 链接目标本轮可不改（仍可为占位）

### 响应式

- `≤768px`：侧栏默认收起；在 `TheHeader` 左侧增加汉堡按钮切换展开/收起；展开时侧栏可遮罩主区（点击遮罩或选中菜单项后收起）
- `>768px`：侧栏常驻，隐藏汉堡按钮，清除移动端展开状态

## 共用转换组件

### 改动文件

- `src/components/BConversion.vue`（双栏互转：Base64、URL encode、大小写、时间戳、IP、mid-url 等）
- `src/components/OneWayConversion.vue`（单向：拼音、短链等）

### 视觉调整

- 标题层级：主标题更重，示例说明更淡
- `el-input` textarea：圆角/边框/焦点环对齐主色 token
- 按钮：主按钮 `--color-primary`；次按钮浅灰蓝底深灰字；去掉「蓝 + 绿」默认对比
- 双栏与按钮区间距按 token 收紧，减少空旷感

### 不变

- props、methods、本地/远程转换逻辑、校验与 `$message` 行为

## 文件改动清单

| 文件 | 动作 |
|---|---|
| `src/styles/theme.css` | 新增 tokens |
| `src/main.js` | 引入 theme.css；如需引入 Google Fonts 则一并处理 |
| `src/App.vue` | 外壳布局样式改用 tokens；窄屏侧栏折叠逻辑 |
| `src/components/TheHeader.vue` | 顶栏样式 |
| `src/components/TheFooter.vue` | 底栏样式 |
| `src/components/BConversion.vue` | 共用双栏转换样式 |
| `src/components/OneWayConversion.vue` | 共用单向转换样式 |

## 验收标准

1. 任意共用转换工具页（如 `/base64`）呈现晴空气质：雾蓝背景、半透明面板、主色激活侧栏
2. Encode/Decode（或单向转换）功能与改前一致
3. 切换侧栏菜单，激活态样式正确，路由正常
4. 微信 Markdown、域名页仅外壳更新，内页不崩
5. 窄屏下侧栏可折叠，桌面侧栏常驻
6. 主题色集中在 CSS 变量；外壳与共用组件无大段旧渐变硬编码

## 风险与缓解

| 风险 | 缓解 |
|---|---|
| Element UI 默认样式覆盖困难 | 用组件根 class + 必要深度选择器（`>>>`）限定作用域 |
| 字体 CDN 加载失败 | 系统字体栈兜底 |
| 窄屏折叠引入状态 bug | 折叠状态仅 UI；默认展开逻辑按断点重置 |

## 后续步骤

1. 用户审阅本 spec
2. 通过后编写实现计划（writing-plans）
3. 按计划实现并目视验收
