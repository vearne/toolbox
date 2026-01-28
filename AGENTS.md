# AGENTS.md - Coding Guidelines for toolbox

## Build & Development Commands

```bash
# Install dependencies
yarn install

# Development server (with hot reload)
yarn start
# or
npm run dev

# Production build
yarn build
# or
npm run build

# Configure dev proxy (if needed)
vim config/dev.env.js
```

**Note**: This project does not have test commands configured. No test framework is set up.

---

## Project Overview

- **Framework**: Vue 2.5.x with Vue Router 3.x
- **UI Library**: Element UI 2.4.x
- **Build Tool**: Webpack 5.x
- **Language**: JavaScript (ES6+) with Babel transpilation
- **HTTP Client**: Axios (attached to Vue prototype as `this.$http`)
- **Other Tools**: markdown-it, highlight.js, vue-clipboard2

---

## Code Style Guidelines

### Formatting
- **Indentation**: 2 spaces (enforced by `.editorconfig`)
- **Quotes**: Single quotes preferred for strings
- **Semicolons**: Required
- **Trailing whitespace**: Trimmed
- **Line endings**: LF
- **Final newline**: Required at end of file

### File Naming
- **Components**: PascalCase - `ToolBase64.vue`, `ToolWeChatMarkdown.vue`
- **Simple components**: Descriptive name + type - `TheHeader.vue`, `TheFooter.vue`
- **Routes**: kebab-case URLs `/base64`, `/wechat-markdown`

### Component Structure
```vue
<template>
  <!-- HTML structure -->
</template>

<script>
import Dependency from 'path/to/dependency'

export default {
  name: 'ComponentName',  // PascalCase
  components: {
    Dependency
  },
  props: ['propName'],  // Array syntax for simple props
  data() {
    return {
      variableName: ''
    }
  },
  computed: {
    // Computed properties
  },
  mounted() {
    // Lifecycle hooks
  },
  methods: {
    methodName() {
      // Method logic
    }
  }
}
</script>

<style scoped>
/* Component-specific styles */
</style>
```

### Import Ordering
1. Vue and core framework
2. Third-party libraries
3. Local components (relative imports)

Example:
```javascript
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import axios from 'axios'

import ToolBase64 from '@/components/ToolBase64'
import StyleConfigPanel from './StyleConfigPanel.vue'
```

### Variable & Function Naming
- **Variables**: camelCase - `leftText`, `markdownText`, `currentStyle`
- **Functions**: camelCase - `forwardOp()`, `convertMarkdown()`, `loadExample()`
- **Constants**: UPPER_SNAKE_CASE (when applicable)
- **Component names**: PascalCase in `name` property

### API Calls
- Axios is available globally as `this.$http`
- Base URL configured as `api` (see `src/main.js`)
- Error handling with `.catch()` and `console.log()`
- Request format: POST with JSON body

Example:
```javascript
this.$http({
  url: '/endpoint',
  method: 'post',
  data: JSON.stringify({ key: value })
}).then((response) => {
  if(response.status == 200){
    this.result = response.data.value
  }
}).catch((error) => {
  console.log(error)
})
```

### Props
- Simple props: Array syntax `props: ['label', 'value']`
- Complex props: Object syntax with types/validation

### Styling
- Use `scoped` CSS in single-file components
- Element UI component customization with deep selectors `>>>` or `/deep/`
- Color variables not centralized - define locally per component
- Responsive: Element UI grid system (`el-row`, `el-col`)

### Router Configuration
- Named components using `components: { main: Component }`
- Named views in App.vue with `<router-view name='main'>`
- Path: kebab-case, Name: camelCase or kebab-case (consistent with path)

### State Management
- Local component state with `data()`
- localStorage for persistence (see `ToolWeChatMarkdown.vue`)
- No Vuex or global store

### Error Handling
- Simple catch blocks with `console.log(error)`
- No centralized error handling
- User feedback via Element UI `$message` component

---

## File Organization

```
src/
├── main.js                 # Entry point, Vue setup
├── App.vue                 # Root component with layout
├── components/             # Feature components
│   ├── Tool*.vue          # Tool-specific pages
│   ├── TheHeader.vue      # Layout components
│   ├── TheFooter.vue
│   └── BConversion.vue    # Reusable conversion component
├── router/
│   └── index.js           # Route definitions
config/
├── dev.env.js             # Dev environment config
└── prod.env.js            # Production environment config
build/                     # Webpack config files
```

---

## Additional Notes

- **No linting configured** (no .eslintrc or similar)
- **No testing framework** present
- **Proxy configuration** available in `config/dev.env.js`
- Build output in `dist/` directory
- Element UI theme: use `element-ui/lib/theme-chalk/index.css`
- Use `$message.success()`, `$message.warning()` for user notifications
- Gradient backgrounds and rounded corners common in UI design
