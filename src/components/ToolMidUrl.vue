<template>
    <BConversion
        left-label1="mid的待编码内容"
        left-label2="形如: 4064159777231488"
        right-label1="mid的待解码内容"
        right-label2="形如: EqV5vuleU"
        left-button="mid编码"
        right-button="mid解码"
        left-param="mid"
        right-param="url"
        request-url="/mid_url"
    ></BConversion>
</template>

<script>
import BConversion from './BConversion';
export default {
  name: 'MidUrl',
  components:{
    BConversion,
  }
}
</script>

