<template>
  <div id="app">
  <el-container>
    <el-header>
      <the-header
        :sidebar-open="sidebarOpen"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      ></the-header>
    </el-header>

    <el-container class="body-container">
      <div
        class="sidebar-backdrop"
        :class="{ 'is-visible': sidebarOpen }"
        @click="sidebarOpen = false"
      ></div>
      <el-aside
        :width="asideWidth"
        class="app-aside"
        :class="{ 'is-open': sidebarOpen }"
      >
          <el-menu :default-active="activeMenu">

            <el-menu-item index="/base64" @click="closeSidebarOnMobile">
              <router-link to="/base64">
                <i class="el-icon-document"></i>
                <span>base64转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/url-encode" @click="closeSidebarOnMobile">
              <router-link to="/url-encode">
                <i class="el-icon-document"></i>
                <span>url-encode转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/upper-lower" @click="closeSidebarOnMobile">
              <router-link to="/upper-lower">
                <i class="el-icon-document"></i>
                <span>大小写转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/timestamp" @click="closeSidebarOnMobile">
              <router-link to="/timestamp">
                <i class="el-icon-time"></i>
                <span>时间戳转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/ip" @click="closeSidebarOnMobile">
                <router-link to="/ip">
                  <i class="el-icon-location"></i>
                  <span>IP和整数互转</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/domain" @click="closeSidebarOnMobile">
                <router-link to="/domain">
                  <i class="el-icon-star-off"></i>
                  <span>查看域名价值</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/pinyin" @click="closeSidebarOnMobile">
               <router-link to="/pinyin">
                  <i class="el-icon-edit"></i>
                  <span>中文转拼音首字母</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/tinyurl" @click="closeSidebarOnMobile">
               <router-link to="/tinyurl">
                  <i class="el-icon-share"></i>
                  <span>短网址服务</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/mid-url" @click="closeSidebarOnMobile">
              <router-link to="/mid-url">
                <i class="el-icon-sort"></i>
                <span>微博mid-url互转</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/wechat-markdown" @click="closeSidebarOnMobile">
              <router-link to="/wechat-markdown">
                <i class="el-icon-document"></i>
                <span>微信Markdown转HTML</span>
              </router-link>
            </el-menu-item>

          </el-menu>
      </el-aside>
      <el-main>
        <router-view name='main'></router-view>
      </el-main>
    </el-container>

    <el-footer>
     <the-footer></the-footer>
    </el-footer>

  </el-container>
  </div>
</template>

<script>
import TheHeader from './components/TheHeader';
import TheFooter from './components/TheFooter';
export default {
  name: 'App',
  components:{
    TheHeader,
    TheFooter
  },
  data() {
    return {
      sidebarOpen: false,
      asideWidth: '220px'
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    }
  },
  methods: {
    closeSidebarOnMobile() {
      if (window.matchMedia('(max-width: 768px)').matches) {
        this.sidebarOpen = false;
      }
    },
    onResize() {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        this.sidebarOpen = false;
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-ui);
    color: var(--color-text);
  }

  #app {
    min-height: 100vh;
    background: var(--bg-gradient);
  }

  .el-header {
    background: transparent;
    color: var(--color-text);
    text-align: center;
    padding: 0 !important;
    height: var(--header-height) !important;
    line-height: var(--header-height);
    border-bottom: 1px solid rgba(30, 41, 53, 0.08);
  }

  .el-footer {
    background: transparent;
    color: var(--color-text-muted);
    text-align: center;
    height: var(--footer-height) !important;
    line-height: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(30, 41, 53, 0.08);
  }

  .body-container {
    position: relative;
    flex: 1;
  }

  .sidebar-backdrop {
    display: none;
  }

  .el-aside,
  .app-aside {
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-panel);
    margin: var(--space-page) 0 var(--space-page) var(--space-page);
    box-shadow: var(--surface-shadow);
    overflow: hidden;
    backdrop-filter: blur(8px);
  }

  .el-main {
    background: var(--surface);
    color: var(--color-text);
    min-height: 600px;
    margin: var(--space-page);
    border-radius: var(--radius-panel);
    border: 1px solid var(--surface-border);
    box-shadow: var(--surface-shadow);
    padding: var(--space-panel) !important;
    backdrop-filter: blur(8px);
  }

  .el-menu {
    border-right: none !important;
    padding: 10px 0;
    background: transparent !important;
  }

  .el-menu-item {
    height: 48px;
    line-height: 48px;
    border-radius: 10px;
    margin: 3px 8px;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    color: var(--color-text-muted);
    font-size: 14px;
    font-family: var(--font-ui);
  }

  .el-menu-item:hover {
    background: rgba(255, 255, 255, 0.85) !important;
    color: var(--color-primary) !important;
  }

  .el-menu-item:hover a {
    color: var(--color-primary) !important;
  }

  .el-menu-item.is-active {
    background: #fff !important;
    color: var(--color-primary) !important;
    box-shadow: 0 1px 3px rgba(15, 40, 70, 0.08);
    font-weight: 600;
  }

  .el-menu-item.is-active a {
    color: var(--color-primary) !important;
  }

  .el-menu-item a {
    color: var(--color-text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: color 0.2s ease;
  }

  .el-menu-item a i {
    margin-right: 8px;
    font-size: 16px;
  }

  .el-menu-item a:hover {
    color: var(--color-primary);
  }

  .el-container {
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .sidebar-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(30, 41, 53, 0.28);
      z-index: 90;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
    }

    .sidebar-backdrop.is-visible {
      opacity: 1;
      pointer-events: auto;
    }

    .el-aside,
    .app-aside {
      position: fixed;
      top: var(--header-height);
      left: 0;
      bottom: var(--footer-height);
      width: var(--aside-width) !important;
      margin: 12px;
      z-index: 100;
      transform: translateX(calc(-100% - 24px));
      transition: transform 0.22s ease;
    }

    .app-aside.is-open {
      transform: translateX(0);
    }

    .el-main {
      margin: 12px;
      padding: 18px !important;
      min-height: 480px;
    }
  }
</style>
