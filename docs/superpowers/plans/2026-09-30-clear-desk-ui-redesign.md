# Clear Desk UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将「萌叔的工具箱」外壳与共用转换组件换成晴空工区（Clear Desk）视觉，并用 CSS 变量集中管理主题。

**Architecture:** 新增 `src/styles/theme.css` 定义 design tokens；`App.vue` / Header / Footer 与 `BConversion` / `OneWayConversion` 改用 tokens；窄屏在 Header 增加汉堡按钮控制侧栏。业务逻辑与路由不变。

**Tech Stack:** Vue 2.5、Element UI 2.4、Webpack 5、纯 CSS 变量（无预处理器要求）

**Spec:** `docs/superpowers/specs/2026-09-30-clear-desk-ui-redesign-design.md`

## Global Constraints

- 不改路由、菜单文案/顺序、工具业务逻辑与 API
- 不重做微信 Markdown / StyleConfigPanel / HeadingConfig / Domain 内页
- 不引入暗色模式、紫色主题、重发光
- 无测试框架：每任务用目视验收 + 必要时 `yarn build` 代替自动化测试
- 提交信息用英文简短 feat/style 前缀；仅在用户要求或计划步骤明确要求时 commit

---

### Task 1: Design Tokens + 字体引入

**Files:**
- Create: `src/styles/theme.css`
- Modify: `src/main.js`（增加 `import '@/styles/theme.css'` 或相对路径）
- Modify: `index.html`（可选 preconnect 已有；字体以 theme.css `@import` 为准）

**Interfaces:**
- Produces: 全局 CSS 变量 `--bg-gradient`、`--surface`、`--surface-border`、`--surface-shadow`、`--color-primary`、`--color-secondary-bg`、`--color-text`、`--color-text-muted`、`--radius-panel`、`--radius-control`、`--space-page`、`--space-panel`、`--font-ui`

- [x] **Step 1: 创建 `src/styles/theme.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg-gradient: linear-gradient(180deg, #dce8f2 0%, #eef3f7 45%, #f5f7fa 100%);
  --surface: rgba(255, 255, 255, 0.78);
  --surface-border: rgba(255, 255, 255, 0.92);
  --surface-shadow: 0 8px 24px rgba(40, 70, 100, 0.06);
  --color-primary: #0b6bcb;
  --color-primary-soft: rgba(11, 107, 203, 0.12);
  --color-secondary-bg: #e8eef5;
  --color-text: #1e2935;
  --color-text-muted: #64748b;
  --color-border: #d5dee8;
  --radius-panel: 16px;
  --radius-control: 12px;
  --space-page: 20px;
  --space-panel: 28px;
  --font-ui: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --header-height: 72px;
  --footer-height: 72px;
  --aside-width: 220px;
}
```

- [ ] **Step 2: 在 `main.js` 引入**

在 Element UI CSS 之后增加：

```js
import './styles/theme.css'
```

（若 `@` 别名已指向 `src`，也可用 `import '@/styles/theme.css'`，与项目现有 import 风格一致即可。）

- [ ] **Step 3: 目视确认**

Run: `yarn start`（或已有 dev server），打开任意页。此时外观可能仍是旧样式，但 DevTools 中 `:root` 应能看到上述变量。

- [ ] **Step 4: Commit（若用户要求提交）**

```bash
git add src/styles/theme.css src/main.js
git commit -m "style: add Clear Desk design tokens"
```

---

### Task 2: 外壳 — App / Header / Footer + 窄屏侧栏

**Files:**
- Modify: `src/App.vue`
- Modify: `src/components/TheHeader.vue`
- Modify: `src/components/TheFooter.vue`

**Interfaces:**
- Consumes: Task 1 tokens
- Produces: `App` data `sidebarOpen`；`TheHeader` prop `sidebarOpen`，emit `toggle-sidebar`；窄屏 aside 显隐 class

- [ ] **Step 1: 更新 `TheHeader.vue`**

- 增加 props: `['sidebarOpen']`
- 模板左侧增加汉堡按钮（仅窄屏 CSS 显示），`@click="$emit('toggle-sidebar')"`
- 样式：透明顶栏、`--font-ui`、`--color-text`；去掉依赖父级青蓝渐变的白色强对比假设，logo 文字用 `--color-text`
- 汉堡：三线图标或 Element `el-icon-s-fold` / `el-icon-s-unfold`，`aria-label="菜单"`

- [ ] **Step 2: 更新 `TheFooter.vue`**

- 弱化底栏：文字用 `--color-text-muted`；链接 hover 用 `--color-primary`
- 去掉对父级高强度渐变底的依赖

- [ ] **Step 3: 重写 `App.vue` 样式与窄屏逻辑**

- `data`: `sidebarOpen: false`
- template: `<the-header :sidebar-open="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen">`
- aside 增加 class：`{:class="{ 'is-open': sidebarOpen }"}`
- 增加遮罩层（窄屏且 open 时显示），点击关闭侧栏
- 菜单 `router-link` `@click.native` 在窄屏关闭侧栏（或 `@click` 在 menu-item）
- `#app` background: `var(--bg-gradient)`；header/footer 透明或浅色 + 底边框
- aside/main：`var(--surface)`、`var(--radius-panel)`、`var(--surface-shadow)`、`var(--surface-border)`
- 菜单激活：白底、`--color-primary` 字色、轻阴影；hover 同主色浅底，非渐变条
- `@media (max-width: 768px)`：aside 固定左侧滑出；默认 `translateX(-105%)`；`.is-open` 滑入；汉堡显示

- [ ] **Step 4: 目视验收**

1. 桌面：雾蓝背景、半透明侧栏/主区、主色激活菜单、顶栏无青蓝渐变
2. 窄屏（DevTools 375px）：侧栏默认隐藏；点汉堡展开；点遮罩或菜单项收起
3. 切换 `/base64`、`/wechat-markdown` 外壳正常

- [ ] **Step 5: Commit（若用户要求）**

```bash
git add src/App.vue src/components/TheHeader.vue src/components/TheFooter.vue
git commit -m "style: restyle shell to Clear Desk layout"
```

---

### Task 3: 共用转换组件换肤

**Files:**
- Modify: `src/components/BConversion.vue`（仅 template 按钮 type + style）
- Modify: `src/components/OneWayConversion.vue`（仅 style；主按钮保持 primary）

**Interfaces:**
- Consumes: Task 1 tokens
- 不变: props、methods、HTTP/本地逻辑

- [ ] **Step 1: 改 `BConversion.vue` 按钮**

- 主按钮保持 `type="primary"`（或自定义 class `btn-primary`）
- 次按钮：去掉 `type="success"`，改为 `class="btn-secondary"`（或 `type="default"` + class），避免绿色

- [ ] **Step 2: 用 tokens 重写两组件 scoped 样式**

共用方向：

```css
.conversion-container { padding: 4px 0; }
.section-header {
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}
.section-header h3 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-family: var(--font-ui);
}
.section-hint {
  font-size: 13px;
  color: var(--color-text-muted);
  font-style: normal;
}
.custom-textarea >>> .el-textarea__inner {
  border-radius: var(--radius-control);
  border: 1px solid var(--color-border);
  /* focus: border-color var(--color-primary); box-shadow 用 --color-primary-soft */
}
.button-section {
  text-align: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}
/* primary / secondary 按钮：圆角 var(--radius-control)，非 25px 胶囊；去掉绿色 success 阴影 */
```

`OneWayConversion` 只保留主按钮样式；readonly textarea 背景用浅灰蓝（如 `#f3f6fa`）。

- [ ] **Step 3: 目视验收**

1. `/base64`：双按钮非蓝绿对比；encode/decode 仍可用
2. `/pinyin` 或 `/tinyurl`：单向按钮与输入框气质一致
3. 功能：空输入仍 warning；正常输入仍出结果

- [ ] **Step 4: Commit（若用户要求）**

```bash
git add src/components/BConversion.vue src/components/OneWayConversion.vue
git commit -m "style: restyle shared conversion components"
```

---

### Task 4: 构建与收尾验收

**Files:** 无新文件（可选跑 `graphify update .`）

- [ ] **Step 1: 生产构建**

Run: `yarn build`  
Expected: 成功退出，无 error（warning 可接受）

- [ ] **Step 2: 对照 spec 验收清单**

- [ ] 雾蓝背景 + 半透明面板 + 主色侧栏激活
- [ ] 共用转换功能不变
- [ ] 侧栏路由切换正常
- [ ] 微信 Markdown / 域名页外壳更新、内页不崩
- [ ] 窄屏折叠侧栏
- [ ] 无大段旧青蓝/粉青渐变硬编码于 App/Header/Footer/BConversion/OneWayConversion

- [ ] **Step 3: `graphify update .`（workspace 规则）**

---

## Spec Coverage Check

| Spec 要求 | Task |
|---|---|
| theme.css tokens + main.js 引入 | Task 1 |
| 顶栏/侧栏/主区/底栏晴空皮肤 | Task 2 |
| 窄屏 Header 汉堡 + 遮罩 | Task 2 |
| BConversion / OneWayConversion 换肤 | Task 3 |
| 不改业务逻辑 / 复杂内页 | 各 Task 约束 |
| 验收标准 | Task 4 |
