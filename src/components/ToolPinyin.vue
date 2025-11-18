<template>
    <div class="pinyin-container">
      <OneWayConversion
          left-label1="中文内容"
          left-label2="形如: 西部世界"
          right-label1="拼音"
          right-label2="形如:xbsj"
          left-button="提取拼音首字母"
          left-param="content"
          right-param="pinyin"
          request-url="/pinyin"
      ></OneWayConversion>
      <div class="api-notice">
        <el-alert
          type="info"
          :closable="false"
          show-icon>
          <template slot="title">
            <span>此服务对应的API免费供大众使用 </span>
            <a href="https://ut-bucket01.sh1a.qingstor.com/tool/%E5%BC%80%E6%94%BEAPI.html" target="_blank" class="doc-link">
              <i class="el-icon-document"></i> 查看文档
            </a>
          </template>
        </el-alert>
      </div>
    </div>
</template>

<script>
import OneWayConversion from './OneWayConversion';
export default {
  name: 'Pinyin',
  components:{
    OneWayConversion,
  }
}
</script>

<style scoped>
.pinyin-container {
  position: relative;
}

.api-notice {
  margin-top: 20px;
  padding: 0 20px;
}

.api-notice >>> .el-alert {
  border-radius: 10px;
  padding: 15px 20px;
}

.doc-link {
  color: #409eff;
  text-decoration: none;
  margin-left: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.doc-link:hover {
  color: #66a6ff;
  transform: translateX(3px);
}

.doc-link i {
  margin-right: 4px;
}
</style>
