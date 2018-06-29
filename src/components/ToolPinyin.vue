<template>
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

