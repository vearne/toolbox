<template>
    <div>
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
      此服务对应的API免费供大众使用<br/><a href="https://ut-bucket01.sh1a.qingstor.com/tool/%E5%BC%80%E6%94%BEAPI.html" target="_blank">文档地址</a>
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

