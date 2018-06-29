<template>
    <BConversion
        left-label1="待转换的IP"
        left-label2="格式形如 '192.168.1.100'"
        right-label1="待转换的整数"
        right-label2="范围应该是 0 ~ 4294967295"
        left-button="IP转换为整数"
        right-button="整数转换为IP"
        left-param="ip"
        right-param="integer"
        request-url="/ip"
    ></BConversion>
</template>

<script>
import BConversion from './BConversion';
export default {
  name: 'IP',
  components:{
    BConversion,
  }
}
</script>

