<template>
  <div id="app">
<!--
    <router-view/>
-->
  <el-container>
    <!-- header -->
    <el-header>
      <the-header></the-header>
    </el-header>

    <!-- middle -->
    <el-container >
      <el-aside width="200px">
          <el-menu :default-active="activeMenu">

            <el-menu-item index="/base64">
              <router-link to="/base64">
                <i class="el-icon-document"></i>
                <span>base64转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/upper-lower">
              <router-link to="/upper-lower">
                <i class="el-icon-document"></i>
                <span>大小写转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/timestamp">
              <router-link to="/timestamp">
                <i class="el-icon-time"></i>
                <span>时间戳转换</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/ip">
                <router-link to="/ip">
                  <i class="el-icon-location"></i>
                  <span>IP和整数互转</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/domain">
                <router-link to="/domain">
                  <i class="el-icon-star-off"></i>
                  <span>查看域名价值</span>
                </router-link>
            </el-menu-item>

            <el-menu-item index="/pinyin">
               <router-link to="/pinyin">
                  <i class="el-icon-edit"></i>
                  <span>中文转拼音首字母</span>
                </router-link>
            </el-menu-item>  

            <el-menu-item index="/tinyurl">
               <router-link to="/tinyurl">
                  <i class="el-icon-share"></i>
                  <span>短网址服务</span>
                </router-link>
            </el-menu-item>  

            <el-menu-item index="/mid-url">
              <router-link to="/mid-url">
                <i class="el-icon-sort"></i>
                <span>微博mid-url互转</span>
              </router-link>
            </el-menu-item>

            <el-menu-item index="/wechat-markdown">
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

    <!-- footer -->
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
  computed: {
    activeMenu() {
      return this.$route.path;
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
  }

  #app {
    min-height: 100vh;
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  }

  .el-header {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
    color: #fff;
    text-align: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 0 !important;
    height: 80px !important;
    line-height: 80px;
  }

  .el-footer {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);
    color: #fff;
    text-align: center;
    height: 70px !important;
    line-height: 70px;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .el-aside {
    background: #fff;
    border-radius: 12px;
    margin: 20px 0 20px 20px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .el-main {
    background: #fff;
    color: #333;
    min-height: 600px;
    margin: 20px 20px 20px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    padding: 30px !important;
  }

  .el-menu {
    border-right: none !important;
    padding-top: 10px;
  }

  .el-menu-item {
    height: 56px;
    line-height: 56px;
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;
    color: #606266;
    font-size: 15px;
  }

  .el-menu-item:hover {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%) !important;
    color: #fff !important;
  }

  .el-menu-item:hover a {
    color: #fff !important;
  }

  .el-menu-item.is-active {
    background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%) !important;
    color: #fff !important;
  }

  .el-menu-item.is-active a {
    color: #fff !important;
  }

  .el-menu-item a {
    color: #606266;
    text-decoration: none;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: color 0.3s ease;
  }

  .el-menu-item a i {
    margin-right: 8px;
    font-size: 16px;
  }

  .el-menu-item a:hover {
    color: #fff;
  }

  .el-container {
    min-height: 100vh;
  }
</style>
