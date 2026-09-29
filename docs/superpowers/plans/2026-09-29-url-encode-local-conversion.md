# URL Encode + Local Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sidebar url-encode/decode (client-side) and move base64, case, timestamp, and IP conversions off the backend onto local functions via an extended `BConversion`.

**Architecture:** Extend `BConversion` with optional `forwardFn` / `reverseFn`. When present, run locally with Element UI messages on empty/invalid input; otherwise keep existing HTTP. Pure helpers live in `src/utils/`. New `ToolUrlEncode` plus menu/route; retrofit four existing tool wrappers.

**Tech Stack:** Vue 2.5, Vue Router 3, Element UI 2.4, Webpack 5; no test framework (verify with `yarn build` + manual UI checks).

## Global Constraints

- Do not change mid-url / pinyin / tinyurl / domain / wechat-markdown behavior.
- Do not add a test framework.
- Sidebar label: `url-encode转换`; path `/url-encode`; place directly under `base64转换`.
- Empty input → `$message.warning('请输入内容')`; conversion errors → `$message.error` with short reason; do not clear the other side.
- Prefer 2-space indent, single quotes, semicolons (project style).

## File Structure

| File | Responsibility |
|------|----------------|
| `src/utils/base64.js` | UTF-8-safe base64 encode/decode |
| `src/utils/ip.js` | IPv4 ↔ unsigned int |
| `src/utils/timestamp.js` | Asia/Shanghai date string ↔ unix seconds |
| `src/utils/urlEncode.js` | encodeURIComponent / decodeURIComponent wrappers |
| `src/utils/caseConvert.js` | toLowerCase / toUpperCase wrappers |
| `src/components/BConversion.vue` | Local fn mode + existing HTTP mode |
| `src/components/ToolUrlEncode.vue` | New tool shell |
| `src/components/ToolBase64.vue` | Wire local base64 fns |
| `src/components/ToolUpperLower.vue` | Wire local case fns |
| `src/components/ToolTimeStamp.vue` | Wire local timestamp fns |
| `src/components/ToolIP.vue` | Wire local IP fns |
| `src/router/index.js` | Register `/url-encode` |
| `src/App.vue` | Sidebar menu item |

---

### Task 1: Conversion utility modules

**Files:**
- Create: `src/utils/base64.js`
- Create: `src/utils/ip.js`
- Create: `src/utils/timestamp.js`
- Create: `src/utils/urlEncode.js`
- Create: `src/utils/caseConvert.js`

**Interfaces:**
- Consumes: none
- Produces:
  - `encodeBase64(str: string): string` / `decodeBase64(str: string): string` (throw `Error` with Chinese message on failure)
  - `ipToInt(ip: string): string` / `intToIp(intStr: string): string`
  - `dateToSec(dateStr: string): string` / `secToDate(secStr: string): string` (format `YYYY-MM-DD HH:mm:ss`, Asia/Shanghai)
  - `encodeUrl(str: string): string` / `decodeUrl(str: string): string`
  - `toLower(str: string): string` / `toUpper(str: string): string`

- [ ] **Step 1: Create `src/utils/urlEncode.js`**

```javascript
export function encodeUrl(str) {
  return encodeURIComponent(str);
}

export function decodeUrl(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    throw new Error('URL解码失败，请检查输入是否合法');
  }
}
```

- [ ] **Step 2: Create `src/utils/caseConvert.js`**

```javascript
export function toLower(str) {
  return str.toLowerCase();
}

export function toUpper(str) {
  return str.toUpperCase();
}
```

- [ ] **Step 3: Create `src/utils/base64.js`**

```javascript
export function encodeBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function decodeBase64(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    throw new Error('Base64解码失败，请检查输入是否合法');
  }
}
```

- [ ] **Step 4: Create `src/utils/ip.js`**

```javascript
export function ipToInt(ip) {
  var parts = ip.trim().split('.');
  if (parts.length !== 4) {
    throw new Error('IP格式不正确');
  }
  var n = 0;
  for (var i = 0; i < 4; i++) {
    if (!/^\d+$/.test(parts[i])) {
      throw new Error('IP格式不正确');
    }
    var x = Number(parts[i]);
    if (x < 0 || x > 255 || String(x) !== parts[i].replace(/^0+(\d)/, '$1') && parts[i] !== '0') {
      // allow "0" but reject "01" style ambiguity: simpler check below
    }
    if (x < 0 || x > 255 || parseInt(parts[i], 10) !== x) {
      throw new Error('IP格式不正确');
    }
    // reject leading zeros like 01 unless the octet is exactly "0"
    if (parts[i].length > 1 && parts[i][0] === '0') {
      throw new Error('IP格式不正确');
    }
    n = n * 256 + x;
  }
  return String(n);
}

export function intToIp(intStr) {
  var raw = intStr.trim();
  if (!/^\d+$/.test(raw)) {
    throw new Error('整数格式不正确');
  }
  var n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 4294967295) {
    throw new Error('整数范围应为 0 ~ 4294967295');
  }
  return [
    (Math.floor(n / 16777216)) % 256,
    (Math.floor(n / 65536)) % 256,
    (Math.floor(n / 256)) % 256,
    n % 256
  ].join('.');
}
```

- [ ] **Step 5: Create `src/utils/timestamp.js`**

```javascript
var DATE_RE = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

export function dateToSec(dateStr) {
  var m = DATE_RE.exec(dateStr.trim());
  if (!m) {
    throw new Error('日期格式应为 YYYY-MM-DD HH:mm:ss');
  }
  var iso = m[1] + '-' + m[2] + '-' + m[3] + 'T' + m[4] + ':' + m[5] + ':' + m[6] + '+08:00';
  var ms = Date.parse(iso);
  if (Number.isNaN(ms)) {
    throw new Error('日期无效');
  }
  return String(Math.floor(ms / 1000));
}

export function secToDate(secStr) {
  var raw = secStr.trim();
  if (!/^-?\d+$/.test(raw)) {
    throw new Error('秒数格式不正确');
  }
  var sec = Number(raw);
  var ms = sec * 1000 + 8 * 3600 * 1000;
  var d = new Date(ms);
  if (Number.isNaN(d.getTime())) {
    throw new Error('秒数无效');
  }
  return (
    d.getUTCFullYear() + '-' +
    pad2(d.getUTCMonth() + 1) + '-' +
    pad2(d.getUTCDate()) + ' ' +
    pad2(d.getUTCHours()) + ':' +
    pad2(d.getUTCMinutes()) + ':' +
    pad2(d.getUTCSeconds())
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/
git commit -m "$(cat <<'EOF'
feat: add local conversion utility helpers

EOF
)"
```

---

### Task 2: Extend `BConversion` for local functions

**Files:**
- Modify: `src/components/BConversion.vue`

**Interfaces:**
- Consumes: none (callers pass props)
- Produces: props `forwardFn` / `reverseFn` (Function, optional); when set, `forwardOp`/`reverseOp` call them instead of `$http`

- [ ] **Step 1: Add props and local execution path**

In `props` array, add `"forwardFn", "reverseFn"`.

Replace `methods` with:

```javascript
methods:{
    runLocal(fn, input, assign){
        if(!input){
            this.$message.warning('请输入内容');
            return;
        }
        try{
            assign(fn(input));
        }catch(e){
            this.$message.error(e && e.message ? e.message : '转换失败');
        }
    },
    forwardOp(){
        if(typeof this.forwardFn === 'function'){
            this.runLocal(this.forwardFn, this.leftText, (v) => { this.rightText = v; });
            return;
        }
        var obj = new Object()
        obj[this.leftParam] = this.leftText;

        this.$http({
            url: this.requestUrl,
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: obj
        }).then((response) => {
            if(response.status == 200){
                console.debug("ok");
                this.rightText = response.data[this.rightParam];
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    reverseOp(){
        if(typeof this.reverseFn === 'function'){
            this.runLocal(this.reverseFn, this.rightText, (v) => { this.leftText = v; });
            return;
        }
        var obj = new Object()
        obj[this.rightParam] = this.rightText;

        this.$http({
            url: this.requestUrl,
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: obj
        }).then((response) => {
            console.info(response.status)
            console.info(response.data[this.leftParam])

            if(response.status == 200){
                this.leftText = response.data[this.leftParam]
            }
        }).catch((error) => {
            console.log(error);
        });
    }
}
```

Keep template and styles unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/components/BConversion.vue
git commit -m "$(cat <<'EOF'
feat: support local forward/reverse fns in BConversion

EOF
)"
```

---

### Task 3: Add url-encode tool + route + menu

**Files:**
- Create: `src/components/ToolUrlEncode.vue`
- Modify: `src/router/index.js`
- Modify: `src/App.vue` (insert menu item after base64 block)

**Interfaces:**
- Consumes: `encodeUrl` / `decodeUrl` from `src/utils/urlEncode.js`; `BConversion` with `:forward-fn` / `:reverse-fn`
- Produces: route `/url-encode`, menu label `url-encode转换`

- [ ] **Step 1: Create `ToolUrlEncode.vue`**

```vue
<template>
  <BConversion
    left-label1="原始文本"
    left-label2="比如 'hello world'"
    right-label1="URL编码后的文本"
    right-label2="hello%20world"
    left-button="encode"
    right-button="decode"
    :forward-fn="encodeUrl"
    :reverse-fn="decodeUrl"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { encodeUrl, decodeUrl } from '@/utils/urlEncode';

export default {
  name: 'UrlEncode',
  components: {
    BConversion
  },
  methods: {
    encodeUrl,
    decodeUrl
  }
}
</script>
```

- [ ] **Step 2: Register route in `src/router/index.js`**

Add import:

```javascript
import UrlEncode from '@/components/ToolUrlEncode'
```

Add route object after the base64 route:

```javascript
{
  path: '/url-encode',
  name: 'url-encode',
  components: {
    main: UrlEncode
  }
},
```

- [ ] **Step 3: Insert menu item in `src/App.vue` immediately after the base64 `el-menu-item`**

```vue
            <el-menu-item index="/url-encode">
              <router-link to="/url-encode">
                <i class="el-icon-document"></i>
                <span>url-encode转换</span>
              </router-link>
            </el-menu-item>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ToolUrlEncode.vue src/router/index.js src/App.vue
git commit -m "$(cat <<'EOF'
feat: add url-encode conversion tool

EOF
)"
```

---

### Task 4: Localize base64, case, timestamp, IP tools

**Files:**
- Modify: `src/components/ToolBase64.vue`
- Modify: `src/components/ToolUpperLower.vue`
- Modify: `src/components/ToolTimeStamp.vue`
- Modify: `src/components/ToolIP.vue`

**Interfaces:**
- Consumes: utils from Task 1; `BConversion` local fn props from Task 2
- Produces: same UI labels/buttons as before; no `request-url`

- [ ] **Step 1: Rewrite `ToolBase64.vue`**

```vue
<template>
  <BConversion
    left-label1="原始文本"
    left-label2="比如 'hello world'"
    right-label1="base64编码后的文本"
    right-label2="aGVsbG8gd29ybGQ="
    left-button="encode"
    right-button="decode"
    :forward-fn="encodeBase64"
    :reverse-fn="decodeBase64"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { encodeBase64, decodeBase64 } from '@/utils/base64';

export default {
  name: 'Base64',
  components: {
    BConversion
  },
  methods: {
    encodeBase64,
    decodeBase64
  }
}
</script>
```

- [ ] **Step 2: Rewrite `ToolUpperLower.vue`**

```vue
<template>
  <BConversion
    left-label1="大写字符串"
    left-label2="HELLO-WORLD"
    right-label1="小写字符串"
    right-label2="hello-world"
    left-button="大写转小写"
    right-button="小写转大写"
    :forward-fn="toLower"
    :reverse-fn="toUpper"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { toLower, toUpper } from '@/utils/caseConvert';

export default {
  name: 'UpperLower',
  components: {
    BConversion
  },
  methods: {
    toLower,
    toUpper
  }
}
</script>
```

- [ ] **Step 3: Rewrite `ToolTimeStamp.vue`**

```vue
<template>
  <BConversion
    left-label1="待转换的日期(东八区)"
    left-label2="格式形如 '2016-01-01 12:35:10'"
    right-label1="待转换的秒"
    right-label2="1970年1月1日午夜到指定日期的秒数"
    left-button="日期转换为秒"
    right-button="秒转换为日期"
    :forward-fn="dateToSec"
    :reverse-fn="secToDate"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { dateToSec, secToDate } from '@/utils/timestamp';

export default {
  name: 'TimeStamp',
  components: {
    BConversion
  },
  methods: {
    dateToSec,
    secToDate
  }
}
</script>
```

- [ ] **Step 4: Rewrite `ToolIP.vue`**

```vue
<template>
  <BConversion
    left-label1="待转换的IP"
    left-label2="格式形如 '192.168.1.100'"
    right-label1="待转换的整数"
    right-label2="范围应该是 0 ~ 4294967295"
    left-button="IP转换为整数"
    right-button="整数转换为IP"
    :forward-fn="ipToInt"
    :reverse-fn="intToIp"
  ></BConversion>
</template>

<script>
import BConversion from './BConversion';
import { ipToInt, intToIp } from '@/utils/ip';

export default {
  name: 'IP',
  components: {
    BConversion
  },
  methods: {
    ipToInt,
    intToIp
  }
}
</script>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ToolBase64.vue src/components/ToolUpperLower.vue src/components/ToolTimeStamp.vue src/components/ToolIP.vue
git commit -m "$(cat <<'EOF'
feat: run base64, case, timestamp, IP conversions locally

EOF
)"
```

---

### Task 5: Verify build and smoke-check

**Files:**
- None (verification only)

- [ ] **Step 1: Production build**

Run: `yarn build`  
Expected: build completes without errors (exit code 0).

- [ ] **Step 2: Manual smoke checklist** (dev server `yarn start` if needed)

1. Menu: `url-encode转换` sits under `base64转换`; route `#/url-encode` works.
2. url-encode: `hello world` → `hello%20world`; decode back.
3. base64: `你好` encode/decode round-trip.
4. 大小写 / 时间戳 / IP: one happy-path each; empty input shows warning.
5. mid-url still posts to backend (Network tab shows `/mid_url`).

- [ ] **Step 3: Update graphify**

Run: `graphify update .`

- [ ] **Step 4: Final commit only if graphify or fixups produced changes**

```bash
git status
# if dirty: add relevant files and commit with message describing the fix
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Extend BConversion with local fns + HTTP fallback | Task 2 |
| Empty / error messaging | Task 2 |
| url-encode tool + route + menu under base64 | Task 3 |
| Localize base64 / case / timestamp / IP | Task 1 + 4 |
| mid-url etc. unchanged | Task 2 HTTP path + Task 5 check |
| No new test framework | Global + Task 5 manual verify |
