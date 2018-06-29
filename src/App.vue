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
          <el-menu>
            <el-menu-item index="1">
              <router-link to="/mid-url">
                微博mid-url互转
              </router-link>
            </el-menu-item>

            <el-menu-item index="2">
              <router-link to="/timestamp">
                时间戳转换
              </router-link>
            </el-menu-item>

            <el-menu-item index="3">
                <router-link to="/ip">
                  IP和整数互转
                </router-link>
            </el-menu-item>

            <el-menu-item index="4">
                <router-link to="/domain">
                  查看域名价值
                </router-link>
            </el-menu-item>

            <el-menu-item index="5">
               <router-link to="/pinyin">
                  中文转拼音首字母
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
  }
}
</script>

<style>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height:850px;
  }
  

</style>
