# AGENTS.md - Developer Guide for Toolbox

## Overview
This is a Vue.js 2 frontend application providing utility tools (Base64 conversion, timestamp conversion, IP conversion, etc.). The app uses Element UI for components and Axios for API requests.

---

## Build Commands

### Development
```bash
yarn install          # Install dependencies
yarn start            # Start dev server (localhost:8080)
```

### Production
```bash
yarn build            # Build for production (outputs to dist/)
```

### Linting/Testing
**Note:** This project currently has no linting or testing infrastructure configured.
- No ESLint/Prettier setup
- No Jest/Vitest setup
- Cannot run single tests (no tests exist)

To add testing: Install Jest/Vitest and add test scripts to package.json.

### Running Single Test
Not available - no test framework configured. Install testing framework first.

---

## Code Style Guidelines

### Imports/Exports
- Use ES6 import/export syntax
- Imports at top of files
- Default exports for Vue components: `export default { name: 'MyComponent', ... }`
- Named exports for routers/configs: `export default new Router({...})`

```javascript
// Correct
import Vue from 'vue'
import App from './App'
import axios from 'axios';

export default {
  name: 'MyComponent',
  components: { ... }
}
```

### Component Structure
Vue single-file components with three sections:
```vue
<template>
  <!-- Element UI components, router-view -->
</template>

<script>
export default {
  name: 'ComponentName',
  components: { ... },
  props: [ ... ],
  data() { return { ... } },
  computed: { ... },
  methods: { ... }
}
</script>

<style scoped>
  /* CSS styles - scoped to component */
</style>
```

### Formatting
- **Indentation:** 2 spaces (configured in .editorconfig)
- **Quotes:** Single quotes for JavaScript, double quotes for HTML/JSON
- **Semicolons:** Always use semicolons
- **Line endings:** LF

```javascript
const myVar = 'value';  // Single quotes, semicolon
```

### Naming Conventions
- **Components:** PascalCase (e.g., `ToolBase64.vue`, `TheHeader.vue`)
- **Variables/Functions:** camelCase (e.g., `leftText`, `forwardOp()`)
- **Props:** camelCase in props array, kebab-case in templates (e.g., `props: ["leftLabel"]` → `left-label="..."`)
- **Routes:** kebab-case paths (e.g., `/base64`, `/timestamp`)
- **CSS classes:** kebab-case (e.g., `.conversion-container`)

### Error Handling
Use promise `.catch()` for async operations:
```javascript
this.$http({
  url: this.requestUrl,
  method: 'post',
  data: JSON.stringify(obj)
}).then((response) => {
  if(response.status == 200) {
    // Success handling
  }
}).catch((error) => {
  console.log(error);
});
```

### API Integration
- Axios is configured globally as `Vue.prototype.$http`
- Base URL: `'api'` (proxied to http://tool.vearne.cc in dev)
- API proxy config: `config/index.js` -> `proxyTable`
- Use `JSON.stringify()` for request bodies
- Modify `config/dev.env.js` for environment variables

### Styling
- Use `scoped` attribute for component-specific styles
- Element UI components can be styled with `>>>` or `/deep/`
- Gradient backgrounds and box shadows common (see App.vue)
- Transitions on hover states

### Router Configuration
- Vue Router with named views (`main` view)
- Routes in `src/router/index.js`
- Use `@/` alias for `src/` directory in imports

---

## Project Structure
```
src/
├── main.js              # Entry point, Vue setup
├── App.vue              # Root component with layout
├── router/
│   └── index.js         # Route definitions
├── components/          # Tool components
│   ├── BConversion.vue  # Reusable conversion component
│   ├── ToolBase64.vue   # Base64 converter
│   ├── ToolTimeStamp.vue
│   └── ...
└── assets/              # Images, static files

build/                   # Webpack configuration
config/                  # Build settings (dev/prod)
```

---

## Development Notes
- Development server: `localhost:8080`
- API proxy configured in `config/index.js`
- Modify `config/dev.env.js` for environment variables
- Production builds output to `dist/` directory
- Babel transpilation with stage-2 features enabled
