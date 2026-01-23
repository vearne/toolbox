# 微信公众号 Markdown 转 HTML 工具需求文档

## 1. 项目概述

### 1.1 背景
用户使用 Markdown 编写微信公众号文章，需要将其转换为可在微信公众号编辑器中直接粘贴的 HTML 格式，并支持多种样式选择和自定义样式功能。

### 1.2 目标
创建一个易用的 Markdown 转 HTML 工具，支持：
- Markdown 实时转换为微信公众号兼容的 HTML
- 多种预设样式主题选择
- 自定义样式配置
- 一键复制 HTML 代码
- 实时预览效果

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 Markdown 编辑器
- **位置**：左侧区域（或上方，取决于布局）
- **功能**：
  - 支持 Markdown 语法高亮
  - 支持常用 Markdown 语法（标题、列表、引用、代码块、链接、图片、表格等）
  - 实时字数统计
  - 支持导出 Markdown 文件（.md）- 仅下载，不上传
  - 支持清空编辑器内容

#### 2.1.2 HTML 预览与输出
- **位置**：右侧区域（或下方）
- **功能**：
  - 实时预览 Markdown 渲染后的 HTML 效果
  - 显示生成的 HTML 源代码
  - 一键复制 HTML 代码
  - 一键复制为富文本（可直接粘贴到微信公众号编辑器）
  - 支持只读模式

#### 2.1.3 Markdown 到 HTML 转换
- **功能**：
  - 使用前端库进行 Markdown 解析（推荐：marked.js 或 markdown-it）
  - 生成符合微信公众号规范的 HTML
  - 保留图片链接（不支持图片上传）
  - 支持代码块语法高亮（需要内联 CSS）

### 2.2 样式管理

#### 2.2.1 预设样式主题
- **功能**：
  - 提供多个预设样式主题（至少 3-5 个）
  - 预设主题样式配置参考：
    - 简约白：白色背景，黑色文字，简洁风格
    - 护眼绿：浅绿背景，适合长时间阅读
    - 商务蓝：专业配色，适合技术类文章
    - 活力橙：暖色调，适合轻松内容
  - 样式切换时实时更新预览
  - 支持主题预览缩略图（可选）

#### 2.2.2 自定义样式配置
- **功能**：
  - 样式配置面板，支持自定义以下样式：
    - 全局设置：
      - 背景颜色（16进制颜色选择器）
      - 文字颜色
      - 字体大小（px）
      - 行高
      - 内边距
    - 标题样式：
      - H1-H6 的字体大小、颜色、粗细
      - 标题边距（上下）
    - 正文样式：
      - 段落间距
      - 首行缩进（是否启用，2em）
    - 引用样式：
      - 背景颜色
      - 边框样式（颜色、宽度、圆角）
      - 引用符号
    - 代码块样式：
      - 背景颜色
      - 文字颜色
      - 边框样式
      - 圆角
    - 列表样式：
      - 列表标记样式（圆点、数字）
      - 列表项间距
    - 表格样式：
      - 边框样式
      - 表头背景色
      - 表头文字颜色
      - 单元格内边距
  - 支持保存自定义样式为本地预设
  - 支持删除自定义样式

#### 2.2.3 样式导出（JSON）
- **JSON 格式导出**：
  - 支持导出当前样式为 JSON 文件（仅下载，不上传）
  - JSON 结构示例：
    ```json
    {
      "styleName": "我的样式",
      "global": {
        "backgroundColor": "#ffffff",
        "textColor": "#333333",
        "fontSize": 16,
        "lineHeight": 1.8,
        "padding": 20
      },
      "headings": {
        "h1": { "fontSize": 24, "color": "#2c3e50", "marginTop": 20 },
        "h2": { "fontSize": 20, "color": "#34495e", "marginTop": 18 },
        ...
      },
      ...
    }
    ```

### 2.3 辅助功能

#### 2.3.1 样式快速切换
- **功能**：
  - 顶部样式选择器下拉菜单
  - 显示当前样式名称
  - 快速切换预设样式和自定义样式

#### 2.3.2 使用帮助/文档
- **功能**：
  - 提供工具使用说明
  - Markdown 语法参考
  - 样式配置说明
  - JSON 导出格式说明

#### 2.3.3 示例内容
- **功能**：
  - 提供示例 Markdown 内容，快速体验工具功能
  - 支持一键加载示例

---

## 3. 非功能需求

### 3.1 性能
- Markdown 转换响应时间 < 500ms（小型文章 < 5000 字）
- 样式切换响应时间 < 300ms
- 页面加载时间 < 2s

### 3.2 兼容性
- 支持主流浏览器（Chrome、Firefox、Safari、Edge 最新版）
- 生成的 HTML 兼容微信公众号编辑器
- 支持移动端响应式布局

### 3.3 可用性
- 界面简洁直观，易于操作
- 提供清晰的操作反馈（成功/失败提示）
- 支持键盘快捷键（可选，如 Ctrl+C 复制）

### 3.4 数据安全
- 所有数据处理在前端完成，不上传到服务器
- 自定义样式存储在本地（localStorage）

---

## 4. 技术方案建议

### 4.1 技术栈
- **前端框架**：Vue.js 2（现有项目）
- **UI 组件库**：Element UI（现有项目）
- **Markdown 解析库**：marked.js 或 markdown-it
- **代码高亮**：highlight.js 或 Prism.js（内联 CSS）
- **颜色选择器**：Element UI Color Picker

### 4.2 组件结构
```
ToolWeChatMarkdown.vue
├── MarkdownEditor.vue        # Markdown 编辑器组件
├── HtmlPreview.vue           # HTML 预览组件
├── HtmlCode.vue              # HTML 源码显示组件
├── StyleSelector.vue         # 样式选择器组件
├── StyleConfigPanel.vue      # 样式配置面板组件
└── StyleImportExport.vue     # 样式导入导出组件
```

### 4.3 数据流
```
Markdown 文本
  ↓
Markdown 解析器（marked/markdown-it）
  ↓
基础 HTML
  ↓
应用内联样式（根据当前样式配置）
  ↓
最终 HTML（用于预览和复制）
```

### 4.4 样式存储方案
- 预设样式：存储在代码中（JavaScript 对象）
- 自定义样式：存储在 localStorage（key: `wechat_markdown_custom_styles`）
- 当前选中样式：存储在 localStorage（key: `wechat_markdown_current_style`）

### 4.5 样式配置数据结构
```javascript
{
  styleName: "样式名称",
  global: {
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontSize: 16,
    lineHeight: 1.8,
    padding: 20,
    maxWidth: "100%"
  },
  headings: {
    h1: { fontSize: 24, color: "#2c3e50", fontWeight: "bold", marginTop: 24, marginBottom: 16 },
    h2: { fontSize: 20, color: "#34495e", fontWeight: "bold", marginTop: 20, marginBottom: 14 },
    h3: { fontSize: 18, color: "#34495e", fontWeight: "bold", marginTop: 18, marginBottom: 12 },
    h4: { fontSize: 16, color: "#34495e", fontWeight: "bold", marginTop: 16, marginBottom: 10 },
    h5: { fontSize: 15, color: "#34495e", fontWeight: "bold", marginTop: 14, marginBottom: 8 },
    h6: { fontSize: 14, color: "#909399", fontWeight: "bold", marginTop: 12, marginBottom: 6 }
  },
  paragraph: {
    fontSize: 16,
    color: "#333333",
    marginBottom: 16,
    textIndent: false, // 首行缩进
    lineHeight: 1.8
  },
  blockquote: {
    backgroundColor: "#f5f5f5",
    borderColor: "#dcdfe6",
    borderStyle: "solid",
    borderWidth: "0 0 0 4px",
    padding: "12px 16px",
    borderRadius: 4,
    color: "#606266",
    fontSize: 15,
    marginBottom: 16
  },
  codeBlock: {
    backgroundColor: "#282c34",
    color: "#abb2bf",
    padding: "16px",
    borderRadius: 6,
    fontSize: 14,
    lineHeight: 1.6,
    overflowX: "auto",
    marginBottom: 16,
    border: "none"
  },
  inlineCode: {
    backgroundColor: "#f5f7fa",
    color: "#e83e8c",
    padding: "2px 6px",
    borderRadius: 3,
    fontSize: 14,
    fontFamily: "Consolas, Monaco, monospace"
  },
  list: {
    itemMarginBottom: 8,
    itemPaddingLeft: 20,
    bulletColor: "#409eff"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: 20,
    border: "1px solid #ebeef5"
  },
  tableHeader: {
    backgroundColor: "#f5f7fa",
    color: "#303133",
    fontWeight: "bold",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ebeef5"
  },
  tableCell: {
    padding: "12px",
    borderBottom: "1px solid #ebeef5",
    color: "#606266"
  },
  link: {
    color: "#409eff",
    textDecoration: "none",
    borderBottom: "1px solid #409eff"
  },
  image: {
    maxWidth: "100%",
    borderRadius: 4,
    marginBottom: 20
  }
}
```

---

## 5. 界面设计建议

### 5.1 页面布局
```
┌─────────────────────────────────────────────────────┐
│  工具标题 + 样式选择器 [▼] + [配置样式] [导出样式]  │
├─────────────────────┬───────────────────────────────┤
│                     │                               │
│   Markdown 编辑器    │        HTML 预览              │
│  (实时预览模式)      │     (渲染效果)                │
│                     │                               │
│  [清空] [导出.md]    │   [复制HTML] [复制富文本]      │
├─────────────────────┴───────────────────────────────┤
│              HTML 源码显示区                        │
│              [一键复制]                             │
└─────────────────────────────────────────────────────┘
```

### 5.2 样式配置面板（抽屉或弹窗）
- 分组显示样式配置项（全局、标题、正文、引用、代码、列表、表格、链接、图片）
- 每个配置项提供：
  - 标签说明
  - 输入控件（颜色选择器、数字输入框、下拉选择等）
  - 实时预览效果（可选）
- 保存/取消按钮

### 5.3 样式导出界面
- 导出按钮（当前样式导出为 JSON 文件）
- JSON 格式说明链接

---

## 6. 实现优先级

### Phase 1：核心功能（MVP）
- [x] Markdown 编辑器
- [x] Markdown 转 HTML 基础转换
- [x] HTML 预览
- [x] 一键复制 HTML 代码
- [ ] 3-5 个预设样式主题
- [ ] 样式切换功能

### Phase 2：样式管理
- [ ] 自定义样式配置面板
- [ ] 保存/删除自定义样式
- [ ] JSON 格式导出样式

### Phase 3：增强功能
- [ ] Markdown 示例内容
- [ ] 使用帮助文档
- [ ] 富文本复制功能（可直接粘贴到微信公众号）

### Phase 4：优化与完善
- [ ] 代码高亮（内联 CSS）
- [ ] 样式预览缩略图
- [ ] 性能优化
- [ ] 响应式优化

---

## 7. 待确认问题

1. **Markdown 解析库选择**：marked.js 还是 markdown-it？（建议：markdown-it，功能更强大）
2. **代码高亮方案**：是否需要？如果需要，使用 highlight.js 还是 Prism.js？（建议：Prism.js，主题更丰富）
3. **富文本复制功能**：是否需要直接复制为富文本（可直接粘贴到微信公众号编辑器）？（建议：Phase 3 实现）
4. **图片处理**：是否需要支持图片上传功能？（已确定：不支持上传，只保留图片链接）

### 已确认的设计决策
- **数据处理**：全部前端处理，不依赖后端 API
- **文件操作**：不支持文件上传，仅支持文件下载（导出）功能

---

## 8. 附录

### 8.1 微信公众号 HTML 规范参考
- 不支持外部 CSS 文件，所有样式需要内联
- 不支持 JavaScript
- 不支持 iframe、embed 等标签
- 图片需要使用外链
- 部分标签可能被过滤

### 8.2 推荐的开源样式主题参考
- https://github.com/sparanoid/chinese-copywriting-guidelines
- https://github.com/markdown-it/markdown-it
- https://github.com/highlightjs/highlight.js

### 8.3 相关技术文档
- Vue.js 2 官方文档：https://v2.vuejs.org/
- Element UI 文档：https://element.eleme.io/
- Markdown-it 文档：https://github.com/markdown-it/markdown-it
- Prism.js 文档：https://prismjs.com/
